import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const now = new Date();
    const welcomeModal = await prisma.welcomeModal.findFirst({
      where: {
        isActive: true,
        OR: [
          {
            startDate: null,
            endDate: null
          },
          {
            startDate: { lte: now },
            endDate: { gte: now }
          },
          {
            startDate: { lte: now },
            endDate: null
          },
          {
            startDate: null,
            endDate: { gte: now }
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(createSuccessResponse(welcomeModal));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch welcome modal', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
