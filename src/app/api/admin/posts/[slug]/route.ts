import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

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
    if (!post) return NextResponse.json(createErrorResponse('Post not found', 'POST_NOT_FOUND'), { status: 404 });
    const tags = post.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || [];
    let media = Array.isArray(post.media) ? post.media : [];
    media = media.map((m) =>
      m.type === 'YOUTUBE'
        ? { ...m, id: m.id && m.id.length === 11 ? m.id : getYoutubeIdFromUrl(m.url) }
        : m
    );
    return NextResponse.json(createSuccessResponse({ ...post, author: post.author?.name || 'Admin', authorId: post.author?.id || '', authorWallet: post.author?.wallet || '', tags, media, comments }));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}

export const PUT = withAdmin(async (req, user) => {
  if (!user) {
    return NextResponse.json(createErrorResponse('User not found', 'USER_NOT_FOUND'), { status: 404 });
  }

  try {
    const slug = req.nextUrl.pathname.split('/').pop();
    if (!slug) {
      return NextResponse.json(createErrorResponse('Missing slug', 'MISSING_SLUG'), { status: 400 });
    }

    const body = await req.json();
    
    const { title, content, status, tags, media, githubRepo } = body;

    if (!title || !content) {
      return NextResponse.json(createErrorResponse('Missing required fields', 'MISSING_FIELDS'), { status: 400 });
    }

    const existingPost = await prisma.post.findFirst({
      where: { slug }
    });

    if (!existingPost) {
      return NextResponse.json(createErrorResponse('Post not found', 'POST_NOT_FOUND'), { status: 404 });
    }
    await prisma.postTag.deleteMany({
      where: { postId: existingPost.id }
    });

    await prisma.media.deleteMany({
      where: { postId: existingPost.id }
    });

    const tagConnections = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        if (typeof tagName === 'string' && tagName.trim()) {
          let tag = await prisma.tag.findFirst({
            where: { name: tagName.trim() }
          });

          if (!tag) {
            tag = await prisma.tag.create({
              data: { name: tagName.trim() }
            });
          }

          tagConnections.push({ tagId: tag.id });
        }
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title,
        content,
        status: status.toUpperCase(),
        githubRepo: githubRepo || null,
        tags: {
          create: tagConnections
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

    return NextResponse.json(createSuccessResponse(updatedPost));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const DELETE = withAdmin(async (req) => {
  const slug = req.nextUrl.pathname.split('/').pop();
  if (!slug) {
    return NextResponse.json(createErrorResponse('Missing slug', 'MISSING_SLUG'), { status: 400 });
  }

  const post = await prisma.post.findFirst({
    where: { slug }
  });

  if (!post) {
    return NextResponse.json(createErrorResponse('Post not found', 'POST_NOT_FOUND'), { status: 404 });
  }

  await prisma.post.delete({
    where: { id: post.id }
  });

  return NextResponse.json(createSuccessResponse({ message: 'Post deleted successfully' }));
}); 