import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        tab: true
      }
    });

    return NextResponse.json(createSuccessResponse(members));
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch members', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req) => {
  const { name, role, description, image, email, color, skills, order, tabId } = await req.json();

  const member = await prisma.member.create({
    data: {
      name,
      role,
      description,
      image,
      email,
      color: color || "blue",
      skills: skills || [],
      order: order || 0,
      tabId: tabId || null,
      isActive: true
    }
  });

  return NextResponse.json(createSuccessResponse(member));
}); 