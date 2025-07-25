import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '~/lib/prisma';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    });
    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const wallet = session.user.address;
    const currentUser = await prisma.user.findUnique({
      where: { wallet },
      include: { role: true },
    });
    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Missing tag name' }, { status: 400 });
    }
    const exist = await prisma.tag.findFirst({ where: { name } });
    if (exist) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    const tag = await prisma.tag.create({ data: { name } });
    return NextResponse.json({ tag });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const wallet = session.user.address;
    const currentUser = await prisma.user.findUnique({
      where: { wallet },
      include: { role: true },
    });
    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing tag id' }, { status: 400 });
    }
    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const wallet = session.user.address;
    const currentUser = await prisma.user.findUnique({
      where: { wallet },
      include: { role: true },
    });
    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id, name } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'Missing tag id or name' }, { status: 400 });
    }
    const exist = await prisma.tag.findFirst({ where: { name, NOT: { id } } });
    if (exist) {
      return NextResponse.json({ error: 'Tag name already exists' }, { status: 409 });
    }
    const tag = await prisma.tag.update({ where: { id }, data: { name } });
    return NextResponse.json({ tag });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 