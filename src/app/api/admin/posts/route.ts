import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

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
        media: { select: { url: true, type: true, id: true } },
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
        media: Array.isArray(post.media)
          ? post.media.map((m: { url: string; type: string; id: string }) =>
              m.type === 'YOUTUBE'
                ? { ...m, id: m.id && m.id.length === 11 ? m.id : getYoutubeIdFromUrl(m.url) }
                : m
            )
          : [],
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

export const POST = withAdmin(async (req, user) => {
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { title, slug, content, status, tags, media, githubRepo } = await req.json();

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existingPost = await prisma.post.findFirst({
    where: { slug }
  });

  if (existingPost) {
    return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      status: status.toUpperCase(),
      authorId: user.id,
      githubRepo: githubRepo || null,
      tags: {
        create: tags?.map((tagId: string) => ({ tagId })) || []
      },
      media: {
        create: media?.map((item: { url: string; type: string }) => ({
          url: item.url,
          type: item.type.toUpperCase()
        })) || []
      }
    },
    include: {
      tags: { include: { tag: true } },
      media: true,
    },
  });

  return NextResponse.json({ post });
});