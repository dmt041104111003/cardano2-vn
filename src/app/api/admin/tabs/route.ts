import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

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

    return NextResponse.json(createSuccessResponse(tabs));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch tabs', 'INTERNAL_ERROR'),
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

  return NextResponse.json(createSuccessResponse(tab));
}); 