import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { generateWalletAvatar } from '~/lib/wallet-avatar';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

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
        address: user.wallet || user.email || '',
        email: user.email,
        provider: user.provider,
        role: user.role.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        avatar: user.image || null,
      };
    });
    
    return NextResponse.json(createSuccessResponse(mapped));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { address, name } = await req.json();
  
  if (!address) {
    return NextResponse.json(createErrorResponse('Missing address', 'MISSING_ADDRESS'), { status: 400 });
  }
  
  const exist = await prisma.user.findUnique({ where: { wallet: address } });
  if (exist) {
    return NextResponse.json(createErrorResponse('User already exists', 'USER_EXISTS'), { status: 409 });
  }
  
  const userRole = await prisma.role.findFirst({ where: { name: 'USER' } });
  if (!userRole) {
    return NextResponse.json(createErrorResponse('Role USER not found', 'ROLE_NOT_FOUND'), { status: 500 });
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
  
  return NextResponse.json(createSuccessResponse(user));
});

export const DELETE = withAdmin(async (req, currentUser) => {
  if (!currentUser) {
    return NextResponse.json(createErrorResponse('User not found', 'USER_NOT_FOUND'), { status: 404 });
  }
  
  const { address } = await req.json();
  
  if (!address) {
    return NextResponse.json(createErrorResponse('Missing address', 'MISSING_ADDRESS'), { status: 400 });
  }
  
  if (address === currentUser.wallet) {
    return NextResponse.json(createErrorResponse('Cannot delete yourself', 'CANNOT_DELETE_SELF'), { status: 400 });
  }
  
  await prisma.user.delete({ where: { wallet: address } });
  return NextResponse.json(createSuccessResponse({ success: true }));
});

export const PATCH = withAdmin(async (req, currentUser) => {
  if (!currentUser) {
    return NextResponse.json(createErrorResponse('User not found', 'USER_NOT_FOUND'), { status: 404 });
  }
  
  try {
    const { address, name, promote } = await req.json();
    
    if (!address) {
      return NextResponse.json(createErrorResponse('Missing address', 'MISSING_ADDRESS'), { status: 400 });
    }
  
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { wallet: address },
          { email: address }
        ]
      },
      include: { role: true },
    });
  
    if (!user) {
      return NextResponse.json(createErrorResponse('User not found', 'USER_NOT_FOUND'), { status: 404 });
    }
  
    if (name !== undefined) {
      if ((user.wallet && user.wallet === currentUser.wallet) || (user.email && user.email === currentUser.email)) {
        return NextResponse.json(createErrorResponse('Forbidden', 'FORBIDDEN'), { status: 403 });
      }
      await prisma.user.update({ where: { id: user.id }, data: { name } });
    }
  
    if (promote !== undefined) {
      if (currentUser.role.name !== 'ADMIN') {
        return NextResponse.json(createErrorResponse('Only admins can change user roles', 'FORBIDDEN'), { status: 403 });
      }
      
      if (promote) {
        if (user.role.name.toUpperCase() === 'ADMIN') {
          return NextResponse.json(createErrorResponse('User is already admin', 'ALREADY_ADMIN'), { status: 400 });
        }
        const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
        if (!adminRole) {
          return NextResponse.json(createErrorResponse('Role ADMIN not found', 'ROLE_NOT_FOUND'), { status: 500 });
        }
        await prisma.user.update({ 
          where: { id: user.id }, 
          data: { roleId: adminRole.id } 
        });
      } else {
        if ((user.wallet && user.wallet === currentUser.wallet) || (user.email && user.email === currentUser.email)) {
          return NextResponse.json(createErrorResponse('Cannot demote yourself', 'CANNOT_DEMOTE_SELF'), { status: 400 });
        }
        
        if (user.role.name.toUpperCase() === 'USER') {
          return NextResponse.json(createErrorResponse('User is already user', 'ALREADY_USER'), { status: 400 });
        }
        const userRole = await prisma.role.findFirst({ where: { name: 'USER' } });
        if (!userRole) {
          return NextResponse.json(createErrorResponse('Role USER not found', 'ROLE_NOT_FOUND'), { status: 500 });
        }
        await prisma.user.update({ where: { id: user.id }, data: { roleId: userRole.id } });
      }
    }
  
    return NextResponse.json(createSuccessResponse({ success: true }));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}); 