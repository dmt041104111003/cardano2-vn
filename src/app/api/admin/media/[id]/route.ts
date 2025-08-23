import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json(createSuccessResponse({ success: true }));
}); 