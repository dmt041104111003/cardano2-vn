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

export async function GET(request: NextRequest) {
  const isPublic = request.nextUrl?.searchParams?.get('public') === '1';
  const titleQuery = request.nextUrl?.searchParams?.get('title') || '';
  try {
    if (isPublic) {
      let where = {};
      if (titleQuery) {
        where = {
          title: {
            contains: titleQuery,
            mode: 'insensitive',
          },
        };
      }
      const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          status: true,
          author: { select: { name: true } },
          media: { select: { url: true, type: true, id: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
        },
      });
      const mapped = posts.map(p => ({
        ...p,
        slug: p.slug || p.id,
        author: p.author?.name || 'Admin',
        media: Array.isArray(p.media)
          ? p.media.map((m: { url: string; type: string; id: string }) =>
              m.type === 'YOUTUBE'
                ? { ...m, id: m.id && m.id.length === 11 ? m.id : getYoutubeIdFromUrl(m.url) }
                : m
            )
          : [],
        tags: p.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || [],
      }));
      return NextResponse.json({ posts: mapped });
    }
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        shares: true,
        createdAt: true,
        updatedAt: true,
        comments_rel: { select: { id: true, userId: true } }, // thêm userId
        reactions: { select: { type: true, userId: true } }, // thêm userId
        author: { select: { name: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    });
    const mapped = posts.map(post => {
      const reactionCount: Record<string, number> = {};
      for (const r of post.reactions) {
        reactionCount[r.type] = (reactionCount[r.type] || 0) + 1;
      }
      return {
        id: post.id,
        title: post.title,
        slug: post.slug || post.id,
        status: post.status,
        shares: post.shares,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        comments: post.comments_rel.length,
        comments_rel: post.comments_rel, 
        reactions: post.reactions,      
        author: post.author?.name || 'Admin',
        tags: post.tags?.map(t => t.tag) || [],
        ...reactionCount,
      };
    });
    return NextResponse.json({ posts: mapped });
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
    
    // Support all 3 providers: Google, GitHub, Cardano
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
    const { title, content, status, tags, media, createdAt, updatedAt } = body;
    if (!title || !content || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const exist = await prisma.post.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
    if (exist) {
      return NextResponse.json({ error: 'Title already exists' }, { status: 409 });
    }

    // Create unique slug from title
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
      createdAt?: Date;
      updatedAt?: Date;
      media?: { create: Array<{ url: string; type: MediaType }> };
      tags?: { create: Array<{ tagId: string }> };
    };

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        status: status.toUpperCase(),
        authorId: currentUser.id,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
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