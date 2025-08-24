import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const content = await prisma.landingContent.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(createSuccessResponse(content));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}
