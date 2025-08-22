import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const GET = withAdmin(async () => {
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
});

export const POST = withAdmin(async (req) => {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Missing tag name' }, { status: 400 });
  }
  
  const exist = await prisma.tag.findFirst({ where: { name } });
  if (exist) {
    return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
  }
  
  const tag = await prisma.tag.create({ data: { name } });
  return NextResponse.json({ tag });
});

export const DELETE = withAdmin(async (req) => {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing tag id' }, { status: 400 });
  }
  
  await prisma.tag.delete({ where: { id } });
  return NextResponse.json({ success: true });
});

export const PATCH = withAdmin(async (req) => {
  const { id, name } = await req.json();
  if (!id || !name) {
    return NextResponse.json({ error: 'Missing tag id or name' }, { status: 400 });
  }
  
  const exist = await prisma.tag.findFirst({ where: { name, NOT: { id } } });
  if (exist) {
    return NextResponse.json({ error: 'Tag name already exists' }, { status: 409 });
  }
  
  const tag = await prisma.tag.update({ where: { id }, data: { name } });
  return NextResponse.json({ tag });
}); 