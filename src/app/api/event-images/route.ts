import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const eventImages = await prisma.eventImages.findMany({
      orderBy: { orderNumber: 'asc' },
    });
    return NextResponse.json(createSuccessResponse(eventImages));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}
