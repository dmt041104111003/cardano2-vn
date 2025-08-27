import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const featureCard = await prisma.featureCard.findUnique({
      where: { id: params.id }
    });

    if (!featureCard) {
      return NextResponse.json(
        createErrorResponse('Feature card not found', 'FEATURE_CARD_NOT_FOUND'),
        { status: 404 }
      );
    }

    return NextResponse.json(createSuccessResponse(featureCard));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch feature card', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}

export const PUT = withAdmin(async (req) => {
  try {
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
    }

    const body = await req.json();    
    const { title, description, iconName, order, publishStatus } = body;

    if (!title || !description || !iconName || !publishStatus) {
      return NextResponse.json(
        createErrorResponse('Missing required fields: title, description, iconName, publishStatus', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    const featureCard = await prisma.featureCard.update({
      where: { id },
      data: {
        title,
        description,
        iconName,
        order: order || 0,
        publishStatus: publishStatus || "DRAFT"
      }
    });

    return NextResponse.json(createSuccessResponse(featureCard));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(`Failed to update feature card: ${error instanceof Error ? error.message : 'Unknown error'}`, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const DELETE = withAdmin(async (req) => {
  console.log('DELETE request received');
  const id = req.nextUrl.pathname.split('/').pop();
  console.log('Feature card ID to delete:', id);
  
  if (!id) {
    console.log('Missing ID error');
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  try {
    console.log('Attempting to delete feature card with ID:', id);
    await prisma.featureCard.delete({
      where: { id }
    });
    console.log('Feature card deleted successfully');

    return NextResponse.json(createSuccessResponse({ success: true }));
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      createErrorResponse(`Failed to delete feature card: ${error instanceof Error ? error.message : 'Unknown error'}`, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});
