import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '~/lib/prisma';
import { generateWalletAvatar } from '~/lib/wallet-avatar';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        sessions: {
          orderBy: { lastAccess: 'desc' },
          take: 1,
        },
      },
    });
    const now = new Date();
    const mapped = users.map((user) => {
      const lastSession = user.sessions[0];
      let status: 'active' | 'inactive' = 'inactive';
      let lastLogin: string | undefined = undefined;
      if (lastSession && lastSession.lastAccess) {
        lastLogin = lastSession.lastAccess.toISOString();
        const diff = (now.getTime() - new Date(lastSession.lastAccess).getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 30) status = 'active';
      }
      return {
        id: user.id,
        name: user.name || '',
        address: user.wallet,
        role: user.role.name,
        status,
        createdAt: user.createdAt.toISOString(),
        lastLogin,
        avatar: user.image || null,
      };
    });
    return NextResponse.json({ users: mapped });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const currentUser = await prisma.user.findUnique({
      where: { wallet: session.user.address },
      include: { role: true },
    });
    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { address, name } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }
    const exist = await prisma.user.findUnique({ where: { wallet: address } });
    if (exist) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const userRole = await prisma.role.findFirst({ where: { name: 'USER' } });
    if (!userRole) {
      return NextResponse.json({ error: 'Role USER not found' }, { status: 500 });
    }
    const avatar = generateWalletAvatar(address);
    const user = await prisma.user.create({
      data: {
        wallet: address,
        name: name || null,
        image: avatar,
        roleId: userRole.id,
      },
      include: { role: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const currentUser = await prisma.user.findUnique({
      where: { wallet: session.user.address },
      include: { role: true },
    });
    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { address } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }
    if (address === currentUser.wallet) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }
    await prisma.user.delete({ where: { wallet: address } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user || !('address' in session.user) || typeof session.user.address !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const currentUser = await prisma.user.findUnique({
      where: { wallet: session.user.address },
      include: { role: true },
    });
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { address, name, promote } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { wallet: address },
      include: { role: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (currentUser.role.name === 'ADMIN' && name !== undefined) {
      await prisma.user.update({ where: { wallet: address }, data: { name } });
      return NextResponse.json({ success: true });
    }
    if (name !== undefined && user.wallet === currentUser.wallet) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (promote) {
      if (user.role.name === 'ADMIN') {
        return NextResponse.json({ error: 'User is already admin' }, { status: 400 });
      }
      const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
      if (!adminRole) {
        return NextResponse.json({ error: 'Role ADMIN not found' }, { status: 500 });
      }
      await prisma.user.update({ where: { wallet: address }, data: { roleId: adminRole.id } });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Cannot demote admin' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 