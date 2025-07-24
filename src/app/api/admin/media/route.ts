import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { wallet: session.user.address },
      include: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const media = await prisma.media.findMany({
      orderBy: { uploadedAt: 'desc' },
      include: {
        post: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    const total = media.length;
    const images = media.filter(m => m.type === 'IMAGE').length;
    const videos = media.filter(m => m.type === 'VIDEO').length;
    const documents = media.filter(m => m.type === 'YOUTUBE').length;
    const unused = media.filter(m => !m.post).length;
    const used = total - unused;

    const transformedMedia = media.map(item => ({
      id: item.id,
      filename: item.url.split('/').pop() || 'unknown',
      originalName: item.url.split('/').pop() || 'unknown',
      mimeType: item.type === 'IMAGE' ? 'image/jpeg' : item.type === 'VIDEO' ? 'video/mp4' : 'application/youtube',
      size: 0,
      path: item.url,
      createdAt: item.uploadedAt.toISOString(),
      updatedAt: item.uploadedAt.toISOString(),
      usedInPosts: item.post ? [item.post.title] : []
    }));

    return NextResponse.json({
      media: transformedMedia,
      stats: {
        total,
        images,
        documents,
        videos,
        unused,
        used
      }
    });

  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { wallet: session.user.address },
      include: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { url, type } = body;

    if (!url || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\/)([a-zA-Z0-9_-]{11})/;
    if (type === 'YOUTUBE' && !youtubeRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        url: url,
        type: type,
        uploadedBy: user.id,
      },
    });

    return NextResponse.json({
      message: 'Media added successfully',
      media: {
        id: media.id,
        url: media.url,
        type: media.type,
      },
    });

  } catch (error) {
    console.error('Error adding media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 