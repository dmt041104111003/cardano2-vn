import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const featureCardIds = searchParams.get('ids');

    let whereClause: any = { 
      publishStatus: 'PUBLISHED'
    };

    // If specific IDs are provided, filter by them
    if (featureCardIds) {
      const ids = featureCardIds.split(',').filter(id => id.trim());
      if (ids.length > 0) {
        whereClause.id = { in: ids };
      }
    }

    const featureCards = await prisma.featureCard.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(createSuccessResponse(featureCards));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch feature cards', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
};
