import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createErrorResponse, createSuccessResponse } from '~/lib/api-response';

export const PUT = withAdmin(async (req, user) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  const body = await req.json();
  const { section, title, subtitle, description, mainText, subText, media1Url, media2Url, media3Url, media4Url } = body;

  if (!section) {
    return NextResponse.json(createErrorResponse('Section is required', 'MISSING_SECTION'), { status: 400 });
  }

  const existingContent = await prisma.landingContent.findUnique({
    where: { id }
  });

  if (!existingContent) {
    return NextResponse.json(createErrorResponse('Content not found', 'CONTENT_NOT_FOUND'), { status: 404 });
  }

  const conflictingContent = await prisma.landingContent.findFirst({
    where: {
      section,
      id: { not: id }
    }
  });

  if (conflictingContent) {
    return NextResponse.json(createErrorResponse('Section already exists', 'SECTION_ALREADY_EXISTS'), { status: 400 });
  }

  const updatedContent = await prisma.landingContent.update({
    where: { id },
    data: {
      section,
      title,
      subtitle,
      description,
      mainText,
      subText,
      media1Url,
      media2Url,
      media3Url,
      media4Url
    },
  });

  return NextResponse.json(createSuccessResponse(updatedContent));
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.landingContent.update({
    where: { id },
    data: { isActive: false }
  });

  return NextResponse.json(createSuccessResponse({ success: true }));
}); 