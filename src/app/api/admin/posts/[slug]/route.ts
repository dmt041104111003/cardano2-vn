import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
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

export async function DELETE(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const params = await context.params;
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

    await prisma.post.delete({
      where: { slug: params.slug },
    });
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const params = await context.params;
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
    if (!body.title || !body.content || !body.status || !body.tags || !body.media) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('PATCH params:', params);
    console.log('PATCH body:', body);
    const isUUID = (str: string) => /^[0-9a-fA-F-]{36}$/.test(str);

    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postId = existingPost.id;

    let tagIds: string[] = [];
    if (body.tags && body.tags.length > 0) {
      if (isUUID(body.tags[0])) {
        tagIds = body.tags;
      } else {
        const tags = await prisma.tag.findMany({
          where: { name: { in: body.tags } },
          select: { id: true }
        });
        tagIds = tags.map(t => t.id);
      }
    }
    console.log('PATCH tagIds:', tagIds);
    await prisma.postTag.deleteMany({
      where: { postId: postId }
    });
    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({
          postId: postId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    try {
      await prisma.media.deleteMany({ where: { postId: postId } });
      let mappedMedia = [];
      if (Array.isArray(body.media) && body.media.length > 0) {
        mappedMedia = body.media.map((m: { id: string; url: string; type: string }) => {
          let mediaId = m.id;
          let type = m.type;
          if (type === 'YOUTUBE' || type === 'youtube') type = 'YOUTUBE';
          else if (type === 'IMAGE' || type === 'image') type = 'IMAGE';
          else if (type === 'VIDEO' || type === 'video') type = 'VIDEO';
          else type = 'IMAGE';
          if (type === 'YOUTUBE') {
            mediaId = getYoutubeIdFromUrl(m.url);
          }
          return {
            url: m.url,
            type,
            postId: postId,
            mediaId,
          };
        });
        console.log('PATCH mappedMedia:', mappedMedia);
        for (const media of mappedMedia) {
          try {
            await prisma.media.create({ data: media });
          } catch (err) {
            console.error('Error creating media:', media, err);
          }
        }
      }

      let newSlug = params.slug;
      if (body.title) {
        const existingSlugs = await prisma.post.findMany({
          where: { 
            slug: { not: params.slug }
          },
          select: { slug: true }
        });
        
        const slugList = existingSlugs.map(p => p.slug);
        newSlug = await createUniqueSlug(body.title, slugList);
      }

      const updated = await prisma.post.update({
        where: { id: postId },
        data: {
          title: body.title,
          content: body.content,
          status: body.status,
          slug: newSlug,
        },
        include: {
          tags: { include: { tag: true } },
          media: true,
        },
      });
      console.log('PATCH updated post:', updated);
      return NextResponse.json({ post: updated });
    } catch (error) {
      console.error('Error updating post:', error);
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 