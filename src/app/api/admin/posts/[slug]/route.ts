import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import cloudinary from '~/lib/cloudinary';
import { createUniqueSlug } from '~/lib/slug';

function getYoutubeIdFromUrl(url: string) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
  return match ? match[1] : '';
}

export async function GET(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const params = await context.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        githubRepo: true,
        author: { select: { id: true, name: true, wallet: true } }, 
        media: { select: { url: true, type: true, id: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
        shares: true,
      },
    });
    const comments = await prisma.comment.findMany({
      where: { postId: post?.id || '' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
        user: { select: { wallet: true, image: true } },
        parentCommentId: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const tags = post.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || [];
    let media = Array.isArray(post.media) ? post.media : [];
    media = media.map((m) =>
      m.type === 'YOUTUBE'
        ? { ...m, id: m.id && m.id.length === 11 ? m.id : getYoutubeIdFromUrl(m.url) }
        : m
    );
    return NextResponse.json({ post: { ...post, author: post.author?.name || 'Admin', authorId: post.author?.id || '', authorWallet: post.author?.wallet || '', tags, media, comments } });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const sessionUser = session.user as { address?: string; email?: string };
    let currentUser = null;
    
    if (sessionUser.address) {
      currentUser = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true },
      });
    } else if (sessionUser.email) {
      currentUser = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true },
      });
    }
    
    if (!currentUser || !currentUser.role || String(currentUser.role.name).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, content, status, tags, media, githubRepo, createdAt, updatedAt } = body;
    if (!title || !content || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const exist = await prisma.post.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
    if (exist) {
      return NextResponse.json({ error: 'Title already exists' }, { status: 409 });
    }

    const existingSlugs = await prisma.post.findMany({
      select: { slug: true }
    });
    const slug = createUniqueSlug(title, existingSlugs.map(p => p.slug || ''));

    let tagIds: string[] = [];
    if (Array.isArray(tags) && tags.length > 0) {
      const foundTags = await prisma.tag.findMany({ where: { name: { in: tags } } });
      tagIds = foundTags.map(t => t.id);
    }

    enum PostStatus {
      DRAFT = 'DRAFT',
      PUBLISHED = 'PUBLISHED',
      ARCHIVED = 'ARCHIVED',
    }
    enum MediaType {
      IMAGE = 'IMAGE',
      YOUTUBE = 'YOUTUBE',
      VIDEO = 'VIDEO',
    }
    type PostCreateInput = {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      status: PostStatus;
      authorId: string;
      githubRepo?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
      media?: { create: Array<{ url: string; type: MediaType }> };
      tags?: { create: Array<{ tagId: string }> };
    };

    const postData: PostCreateInput = {
      title,
      slug,
      content,
      status: status.toUpperCase() as PostStatus,
      authorId: currentUser.id,
      githubRepo: githubRepo || null,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      updatedAt: updatedAt ? new Date(updatedAt) : undefined,
    };

    const post = await prisma.post.create({
      data: postData,
      include: {
        tags: { include: { tag: true } },
        media: true,
      },
    });

    if (Array.isArray(media) && media.length > 0) {
      for (const mediaItem of media) {
        if (mediaItem.url && mediaItem.type) {
          let mediaData: any = {
            url: mediaItem.url,
            type: mediaItem.type.toUpperCase(),
            postId: post.id,
            uploadedBy: currentUser.id,
          };

          if (mediaItem.type.toUpperCase() === 'YOUTUBE' && mediaItem.id) {
            mediaData.mediaId = mediaItem.id;
          }

          if (mediaItem.type.toUpperCase() === 'IMAGE' && /^data:image\//.test(mediaItem.url)) {
            try {
              const uploadRes = await cloudinary.uploader.upload(mediaItem.url, { resource_type: 'image' });
              mediaData.url = uploadRes.url;
            } catch (e) {
              console.error('Cloudinary upload failed:', e);
              continue; // Skip this media item if upload fails
            }
          }

          await prisma.media.create({
            data: mediaData,
          });
    }
      }
    }

    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map(tagId => ({
          postId: post.id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    const completePost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        tags: { include: { tag: true } },
        media: true,
      },
    });

    return NextResponse.json({ post: completePost });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}