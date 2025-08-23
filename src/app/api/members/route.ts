import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        tab: true
      }
    });
    return NextResponse.json(createSuccessResponse(members));
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}
