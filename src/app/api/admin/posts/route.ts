import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';
import { validateRequest, CreatePostSchema } from '~/lib/validation';

function getYoutubeIdFromUrl(url: string) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
  return match ? match[1] : '';
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isPublic = searchParams.get('public') === '1';
  const titleQuery = searchParams.get('title') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const offset = (page - 1) * limit;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const status = searchParams.get('status');
  const authorId = searchParams.get('authorId');

  try {
    let where: any = {};
    if (titleQuery) {
      where.title = {
        contains: titleQuery,
        mode: 'insensitive',
      };
    }
    
    if (isPublic) {
      where.status = 'PUBLISHED';
    }
    
    if (status) {
      where.status = status as any;
    }
    
    if (authorId) {
      where.authorId = authorId;
    }
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          shares: true,
          createdAt: true,
          updatedAt: true,
          comments_rel: { select: { id: true, userId: true } },
          reactions: { select: { type: true, userId: true } },
          author: { select: { name: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
          media: { select: { url: true, type: true, id: true } },
        },
      }),
      prisma.post.count({ where })
    ]);

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
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    return NextResponse.json(createSuccessResponse(mapped, pagination));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}

export const POST = withAdmin(async (req, user) => {
  if (!user) {
    return NextResponse.json(createErrorResponse('User not found', 'USER_NOT_FOUND'), { status: 404 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, status, tags, media, githubRepo } = validateRequest(CreatePostSchema, body);

    const existingPost = await prisma.post.findFirst({
      where: { slug }
    });

    if (existingPost) {
      return NextResponse.json(createErrorResponse('Post with this slug already exists', 'SLUG_EXISTS'), { status: 409 });
    }

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

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        status: status.toUpperCase() as any,
        authorId: user.id,
        githubRepo: githubRepo || null,
        tags: {
          create: tagConnections
        },
        media: {
          create: media?.map((item: { url: string; type: string }) => ({
            url: item.url,
            type: item.type.toUpperCase() as any
          })) || []
        }
      },
      include: {
        tags: { include: { tag: true } },
        media: true,
      },
    });

    return NextResponse.json(createSuccessResponse(post));
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(createErrorResponse(error.message, 'VALIDATION_ERROR'), { status: 400 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});