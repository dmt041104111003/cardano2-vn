import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

export const GET = withAdmin(async () => {
  try {
    const locations = await prisma.eventLocation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(createSuccessResponse(locations));
  } catch {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { name, publishStatus } = await req.json();
  
  if (!name) {
    return NextResponse.json(createErrorResponse('Missing location name', 'MISSING_LOCATION_NAME'), { status: 400 });
  }
  
  const exist = await prisma.eventLocation.findFirst({ where: { name } });
  if (exist) {
    return NextResponse.json(createErrorResponse('Location already exists', 'LOCATION_ALREADY_EXISTS'), { status: 409 });
  }
  
  const location = await prisma.eventLocation.create({
    data: { name, publishStatus }
  });
  
  return NextResponse.json(createSuccessResponse(location));
}); 