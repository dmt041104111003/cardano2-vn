import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as { address?: string; email?: string };
    let user = null;

    if (sessionUser.address) {
      user = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true }
      });
    } else if (sessionUser.email) {
      user = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true }
      });
    }

    if (!user || user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { section, title, subtitle, description, mediaId, youtubeUrl } = body;

    if (!section) {
      return NextResponse.json({ error: 'Section is required' }, { status: 400 });
    }

    const existingContent = await prisma.landingContent.findFirst({
      where: {
        section,
        id: { not: params.id }
      }
    });

    if (existingContent) {
      return NextResponse.json({ error: 'Section already exists' }, { status: 400 });
    }

    const updatedContent = await prisma.landingContent.update({
      where: { id: params.id },
      data: {
        section,
        title,
        subtitle,
        description,
        mediaId,
        youtubeUrl
      },
      include: {
        media: {
          select: {
            id: true,
            url: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating landing content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as { address?: string; email?: string };
    let user = null;

    if (sessionUser.address) {
      user = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true }
      });
    } else if (sessionUser.email) {
      user = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true }
      });
    }

    if (!user || user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.landingContent.update({
      where: { id: params.id },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting landing content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 