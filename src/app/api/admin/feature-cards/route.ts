import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const featureCards = await prisma.featureCard.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(createSuccessResponse(featureCards));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch feature cards', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req) => {
  try {
    const body = await req.json();    
    const { title, description, iconName, order, publishStatus } = body;

    if (!title || !description || !iconName || !publishStatus) {
      return NextResponse.json(
        createErrorResponse('Missing required fields: title, description, iconName, publishStatus', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    const featureCard = await prisma.featureCard.create({
      data: {
        title,
        description,
        iconName,
        order: order || 0,
        publishStatus
      }
    });

    return NextResponse.json(createSuccessResponse(featureCard));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(`Failed to create feature card: ${error instanceof Error ? error.message : 'Unknown error'}`, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});
