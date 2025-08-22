import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { generateWalletAvatar } from '~/lib/wallet-avatar';
import { NextRequest } from 'next/server';
import { withAdmin } from '~/lib/api-wrapper';

export const GET = withAdmin(async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });
    
    const mapped = users.map((user) => {
      return {
        id: user.id,
        name: user.name || '',
        address: user.wallet,
        email: user.email,
        provider: user.provider,
        role: user.role.name,
        createdAt: user.createdAt.toISOString(),
        avatar: user.image || null,
      };
    });
    
    return NextResponse.json({ users: mapped });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { address, name } = await req.json();
  
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
});

export const DELETE = withAdmin(async (req, currentUser) => {
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const { address } = await req.json();
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  if (address === currentUser.wallet) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }
  
  await prisma.user.delete({ where: { wallet: address } });
  return NextResponse.json({ success: true });
});

export const PATCH = withAdmin(async (req, currentUser) => {
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const { address, name, promote } = await req.json();
  
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
}); 