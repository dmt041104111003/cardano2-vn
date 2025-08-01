import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const tabs = await prisma.tab.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        members: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({ tabs });
  } catch (error) {
    console.error('Error fetching tabs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tabs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, order } = await request.json();

    const tab = await prisma.tab.create({
      data: {
        name,
        order: order || 0,
        isActive: true
      }
    });

    return NextResponse.json({ tab });
  } catch (error) {
    console.error('Error creating tab:', error);
    return NextResponse.json(
      { error: 'Failed to create tab' },
      { status: 500 }
    );
  }
} 