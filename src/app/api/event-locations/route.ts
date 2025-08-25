import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const eventLocations = await prisma.eventLocation.findMany({
      where: { 
        isActive: true,
        publishStatus: 'PUBLISHED'
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(createSuccessResponse(eventLocations));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}
