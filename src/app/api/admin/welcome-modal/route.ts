import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
  try {
    const welcomeModal = await prisma.welcomeModal.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(welcomeModal || null);
  } catch (error) {
    console.error('Error fetching welcome modal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch welcome modal' },
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { title, description, imageUrl, buttonLink, startDate, endDate } = body;

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
        updatedAt: new Date()
      }
    });

    return NextResponse.json(welcomeModal);
  } else {
    const welcomeModal = await prisma.welcomeModal.create({
      data: {
        title,
        description,
        imageUrl,
        buttonLink,
        startDate: finalStartDate,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true
      }
    });

    return NextResponse.json(welcomeModal);
  }
});
