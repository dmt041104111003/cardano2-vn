import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

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
    return NextResponse.json(createSuccessResponse(tags));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json(createErrorResponse('Missing tag name', 'MISSING_NAME'), { status: 400 });
  }
  
  const exist = await prisma.tag.findFirst({ where: { name } });
  if (exist) {
    return NextResponse.json(createErrorResponse('Tag already exists', 'TAG_EXISTS'), { status: 409 });
  }
  
  const tag = await prisma.tag.create({ data: { name } });
  return NextResponse.json(createSuccessResponse(tag));
});

export const DELETE = withAdmin(async (req) => {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing tag id', 'MISSING_ID'), { status: 400 });
  }
  
  await prisma.tag.delete({ where: { id } });
  return NextResponse.json(createSuccessResponse({ success: true }));
});

export const PATCH = withAdmin(async (req) => {
  const { id, name } = await req.json();
  if (!id || !name) {
    return NextResponse.json(createErrorResponse('Missing tag id or name', 'MISSING_FIELDS'), { status: 400 });
  }
  
  const exist = await prisma.tag.findFirst({ where: { name, NOT: { id } } });
  if (exist) {
    return NextResponse.json(createErrorResponse('Tag name already exists', 'TAG_EXISTS'), { status: 409 });
  }
  
  const tag = await prisma.tag.update({ where: { id }, data: { name } });
  return NextResponse.json(createSuccessResponse(tag));
}); 