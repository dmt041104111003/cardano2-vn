import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Next.js 15: params là Promise, phải await
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        post: {
          select: { id: true }
        }
      }
    });
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
    if (media.postId) {
      return NextResponse.json(
        { 
          error: 'Cannot delete media that is being used in posts',
          message: 'This media file is currently being used in a post and cannot be deleted'
        },
        { status: 400 }
      );
    }
    await prisma.media.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 