import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const welcomeModal = await prisma.WelcomeModal.findFirst({
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, buttonLink, startDate, endDate } = body;

    const finalStartDate = startDate && startDate.trim() !== '' ? new Date(startDate) : new Date();

    const existingModal = await prisma.WelcomeModal.findFirst({
      where: { isActive: true }
    });

    if (existingModal) {
      const welcomeModal = await prisma.WelcomeModal.update({
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
      const welcomeModal = await prisma.WelcomeModal.create({
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
  } catch (error) {
    console.error('Error updating welcome modal:', error);
    return NextResponse.json(
      { error: 'Failed to update welcome modal' },
      { status: 500 }
    );
  }
}
