import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createErrorResponse, createSuccessResponse } from '~/lib/api-response';

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(createErrorResponse('Name is required', 'MISSING_NAME'), { status: 400 });
  }

  const existingLocation = await prisma.eventLocation.findFirst({
    where: {
      name,
      id: { not: id }
    }
  });

  if (existingLocation) {
    return NextResponse.json(createErrorResponse('Location name already exists', 'LOCATION_NAME_ALREADY_EXISTS'), { status: 400 });
  }

  const updatedLocation = await prisma.eventLocation.update({
    where: { id },
    data: { name }
  });

  return NextResponse.json(createSuccessResponse(updatedLocation));
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.eventLocation.delete({
    where: { id }
  });

  return NextResponse.json(createSuccessResponse({ success: true }));
}); 