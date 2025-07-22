import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';

function getYoutubeIdFromUrl(url: string) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
  return match ? match[1] : '';
}

export async function GET(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const params = await context.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        author: { select: { name: true } },
        media: { select: { url: true, type: true, id: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
        shares: true,
      },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const tags = post.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || [];
    let media = Array.isArray(post.media) ? post.media : [];
    media = media.map((m) =>
      m.type === 'YOUTUBE'
        ? { ...m, id: m.id && m.id.length === 11 ? m.id : getYoutubeIdFromUrl(m.url) }
        : m
    );
    return NextResponse.json({ post: { ...post, author: post.author?.name || 'Admin', tags, media } });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || !session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const wallet = typeof session.user.address === 'string' ? session.user.address : '';
    const currentUser = await prisma.user.findUnique({
      where: { wallet },
      include: { role: true },
    });
    if (!currentUser || !currentUser.role || String(currentUser.role.name).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || !session.user.address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const wallet = typeof session.user.address === 'string' ? session.user.address : '';
    const currentUser = await prisma.user.findUnique({
      where: { wallet },
      include: { role: true },
    });
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
      where: { postId: params.id }
    });
    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({
          postId: params.id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    try {
      await prisma.media.deleteMany({ where: { postId: params.id } });
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
            postId: params.id,
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
      const updated = await prisma.post.update({
        where: { id: params.id },
        data: {
          title: body.title,
          content: body.content,
          status: body.status,
        },
        include: {
          tags: { include: { tag: true } },
          media: true,
        },
      });
      console.log('PATCH updated post:', updated);
      return NextResponse.json({ post: updated });
    } catch (err) {
      let message = 'Prisma error';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as Record<string, unknown>).message === 'string') {
        message = (err as Record<string, unknown>).message as string;
      }
      console.error('Prisma update error:', err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch {

  }
} 