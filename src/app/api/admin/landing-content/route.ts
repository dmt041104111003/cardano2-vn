import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const content = await prisma.landingContent.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(createSuccessResponse(content));
  } catch {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { section, title, subtitle, description, mainText, subText, media1Url, media2Url, media3Url, media4Url, publishStatus } = await req.json();
  
  if (!section) {
    return NextResponse.json(createErrorResponse('Section is required', 'MISSING_SECTION'), { status: 400 });
  }
  
  const existingContent = await prisma.landingContent.findFirst({
    where: { section }
  });
  
  if (existingContent) {
    return NextResponse.json(createErrorResponse('Section already exists', 'SECTION_ALREADY_EXISTS'), { status: 409 });
  }
  
  const content = await prisma.landingContent.create({
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
      media4Url,
      publishStatus
    }
  });
  
  return NextResponse.json(createSuccessResponse(content));
}); 