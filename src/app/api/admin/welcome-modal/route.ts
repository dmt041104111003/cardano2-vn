import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const welcomeModal = await prisma.welcomeModal.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(createSuccessResponse(welcomeModal || null));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch welcome modal', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { title, description, imageUrl, buttonLink, startDate, endDate, publishStatus } = body;

  const finalStartDate = startDate && startDate.trim() !== '' ? new Date(startDate) : new Date();

  const existingModal = await prisma.welcomeModal.findFirst({
    where: { isActive: true }
  });

  if (existingModal) {
    const welcomeModal = await prisma.welcomeModal.update({
      where: { id: existingModal.id },
      data: {
        title,
        description,
        imageUrl,
        buttonLink,
        startDate: finalStartDate,
        endDate: endDate ? new Date(endDate) : null,
        publishStatus,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(createSuccessResponse(welcomeModal));
  } else {
    const welcomeModal = await prisma.welcomeModal.create({
      data: {
        title,
        description,
        imageUrl,
        buttonLink,
        startDate: finalStartDate,
        endDate: endDate ? new Date(endDate) : null,
        publishStatus,
        isActive: true
      }
    });

    return NextResponse.json(createSuccessResponse(welcomeModal));
  }
});
