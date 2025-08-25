import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const aboutContent = await prisma.aboutContent.findFirst({
      where: { 
        isActive: true,
        publishStatus: 'PUBLISHED'
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(createSuccessResponse(aboutContent));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch about content', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
