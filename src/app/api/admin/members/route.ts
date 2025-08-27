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
    return NextResponse.json(
      createErrorResponse('Failed to fetch members', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const POST = withAdmin(async (req) => {
  try {
    const body = await req.json();    
    const { name, role, description, image, email, color, skills, order, tabId, publishStatus } = body;

    if (!name || !role || !description) {
      return NextResponse.json(
        createErrorResponse('Missing required fields: name, role, description', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        name,
        role,
        description,
        image: image || "",
        email: email || null,
        color: color || "blue",
        skills: skills || [],
        publishStatus: publishStatus || "DRAFT",
        order: order || 0,
        tabId: tabId || null,
        isActive: true
      }
    });

    return NextResponse.json(createSuccessResponse(member));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(`Failed to create member: ${error instanceof Error ? error.message : 'Unknown error'}`, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}); 