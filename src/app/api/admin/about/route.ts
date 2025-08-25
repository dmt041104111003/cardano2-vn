import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const aboutContent = await prisma.aboutContent.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(createSuccessResponse(aboutContent));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch about content', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req) => {
  const { title, subtitle, description, youtubeUrl, buttonText, buttonUrl, publishStatus } = await req.json();

  const existingContent = await prisma.aboutContent.findFirst({
    where: { isActive: true }
  });

  if (existingContent) {
    const aboutContent = await prisma.aboutContent.update({
      where: { id: existingContent.id },
      data: {
        title,
        subtitle,
        description,
        youtubeUrl,
        buttonText,
        buttonUrl,
        publishStatus,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(createSuccessResponse(aboutContent));
  } else {
    const aboutContent = await prisma.aboutContent.create({
      data: {
        title,
        subtitle,
        description,
        youtubeUrl,
        buttonText,
        buttonUrl,
        publishStatus,
        isActive: true
      }
    });

    return NextResponse.json(createSuccessResponse(aboutContent));
  }
}); 