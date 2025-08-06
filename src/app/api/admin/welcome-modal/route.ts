import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, buttonLink, startDate, endDate } = body;

    await prisma.welcomeModal.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    const welcomeModal = await prisma.welcomeModal.create({
      data: {
        title,
        description,
        imageUrl,
        buttonLink,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true
      }
    });

    return NextResponse.json(welcomeModal);
  } catch (error) {
    console.error('Error creating welcome modal:', error);
    return NextResponse.json(
      { error: 'Failed to create welcome modal' },
      { status: 500 }
    );
  }
}
