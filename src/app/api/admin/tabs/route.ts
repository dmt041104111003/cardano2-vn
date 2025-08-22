import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
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
});

export const POST = withAdmin(async (req) => {
  const { name, order } = await req.json();

  const tab = await prisma.tab.create({
    data: {
      name,
      order: order || 0,
      isActive: true
    }
  });

  return NextResponse.json({ tab });
}); 