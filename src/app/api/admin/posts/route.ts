import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import cloudinary from '~/lib/cloudinary';

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
          createdAt: true,
          status: true,
          author: { select: { name: true } },
          media: { select: { url: true, type: true, id: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
        },
      });
      const mapped = posts.map(p => ({
        ...p,
        slug: p.id,
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
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const wallet = session.user.address;
    const currentUser = await prisma.user.findUnique({
      where: { wallet },
      include: { role: true },
    });
    if (!currentUser || String(currentUser.role.name).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const { title, content, excerpt, status, tags, media, createdAt, updatedAt } = body;
    if (!title || !content || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const exist = await prisma.post.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
    if (exist) {
      return NextResponse.json({ error: 'Title already exists' }, { status: 409 });
    }
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
      content: string;
      excerpt?: string;
      status: PostStatus;
      authorId: string;
      createdAt?: Date;
      updatedAt?: Date;
      media?: { create: Array<{ url: string; type: MediaType }> };
      tags?: { create: Array<{ tagId: string }> };
    };
    const data: PostCreateInput = {
      title,
      content,
      excerpt,
      status: status as PostStatus,
      authorId: currentUser.id,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      updatedAt: updatedAt ? new Date(updatedAt) : undefined,
    };
    if (Array.isArray(media) && media.length > 0) {
      const uploadedMedia = await Promise.all(
        (media as Array<{ url: string; type: MediaType }> ).map(async (m) => {
          if (m.type === 'IMAGE' && /^data:image\//.test(m.url)) {
            try {
              const uploadRes = await cloudinary.uploader.upload(m.url, { resource_type: 'image' });
              return { url: uploadRes.url, type: m.type };
            } catch (e) {
              console.error('Cloudinary upload failed:', e);
              return null;
            }
          }
          return m;
        })
      );
      data.media = { create: (uploadedMedia.filter(Boolean) as { url: string; type: MediaType }[]) };
    }
    if (tagIds.length > 0) {
      data.tags = { create: tagIds.map(tagId => ({ tagId })) };
    }
    console.log('DEBUG POST DATA:', JSON.stringify(data, null, 2));
    try {
      const post = await prisma.post.create({ data });
      return NextResponse.json({ post });
    } catch (err: unknown) {
      let message = 'Unknown error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'object' && err && 'message' in err) message = String((err as { message?: unknown }).message);
      else message = String(err);
      console.error('PRISMA CREATE ERROR:', message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}