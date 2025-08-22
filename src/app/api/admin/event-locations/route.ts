import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const GET = withAdmin(async () => {
  try {
    const locations = await prisma.eventLocation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ locations });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { name } = await req.json();
  
  if (!name) {
    return NextResponse.json({ error: 'Missing location name' }, { status: 400 });
  }
  
  const exist = await prisma.eventLocation.findFirst({ where: { name } });
  if (exist) {
    return NextResponse.json({ error: 'Location already exists' }, { status: 409 });
  }
  
  const location = await prisma.eventLocation.create({
    data: { name }
  });
  
  return NextResponse.json({ location });
}); 