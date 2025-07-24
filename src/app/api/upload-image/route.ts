import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const url = formData.get('url');
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }
    const isHttpImage = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    const isDataImage = /^data:image\//.test(url);
    if (!isHttpImage && !isDataImage) {
      return NextResponse.json({ error: 'Invalid image URL. Only direct image links or data:image are allowed.' }, { status: 400 });
    }
    const media = await prisma.media.create({
      data: {
        url,
        type: 'IMAGE',
        uploadedBy: user.id,
      },
    });
    return NextResponse.json({
      message: 'Image saved successfully',
      media: {
        id: media.id,
        url: media.url,
        type: media.type,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 