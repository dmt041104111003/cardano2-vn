import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const GET = withAdmin(async () => {
  try {
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
    
    // Nhóm theo url
    const grouped = new Map();
    for (const item of media) {
      if (!grouped.has(item.url)) {
        grouped.set(item.url, {
          ...item,
          usageCount: 0,
          usageTitles: [],
          ids: [],
        });
      }
      const g = grouped.get(item.url);
      if (item.post) {
        g.usageCount++;
        g.usageTitles.push(item.post.title);
        g.ids.push(item.id);
      }
    }
    
    const transformedMedia = Array.from(grouped.values()).map(item => ({
      id: item.id,
      filename: item.url.split('/').pop() || 'unknown',
      originalName: item.url.split('/').pop() || 'unknown',
      mimeType: item.type === 'IMAGE' ? 'image/jpeg' : item.type === 'VIDEO' ? 'video/mp4' : 'application/youtube',
      size: 0,
      path: item.url,
      createdAt: item.uploadedAt.toISOString(),
      updatedAt: item.uploadedAt.toISOString(),
      usageCount: item.usageCount,
      usageTitles: item.usageTitles,
      ids: item.ids,
      type: item.type
    }));
    
    // Thống kê
    const total = transformedMedia.length;
    const images = transformedMedia.filter(m => m.type === 'IMAGE').length;
    const videos = transformedMedia.filter(m => m.type === 'VIDEO').length;
    const documents = transformedMedia.filter(m => m.type === 'YOUTUBE').length;
    const used = transformedMedia.reduce((acc, m) => acc + (m.usageCount > 0 ? 1 : 0), 0);
    const unused = total - used;
    
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req, user) => {
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const body = await req.json();
  const { url, type } = body;
  
  if (!url || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Validate YouTube URL
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\/)([a-zA-Z0-9_-]{11})/;
  if (type === 'YOUTUBE' && !youtubeRegex.test(url)) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }
  
  const exist = await prisma.media.findFirst({ where: { url, type } });
  if (exist) {
    return NextResponse.json({
      message: 'Media already exists',
      media: {
        id: exist.id,
        url: exist.url,
        type: exist.type,
      },
      reused: true
    });
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
    reused: false
  });
}); 