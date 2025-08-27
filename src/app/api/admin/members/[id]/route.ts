import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: params.id }
    });

    if (!member) {
      return NextResponse.json(
        createErrorResponse('Member not found', 'MEMBER_NOT_FOUND'),
        { status: 404 }
      );
    }

    return NextResponse.json(createSuccessResponse(member));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch member', 'INTERNAL_ERROR'),
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
    const { name, role, description, image, email, color, skills, order, tabId, isActive, publishStatus } = body;

    if (!name || !role || !description) {
      return NextResponse.json(
        createErrorResponse('Missing required fields: name, role, description', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        role,
        description,
        image: image || "",
        email: email || null,
        color: color || "blue",
        skills: skills || [],
        order: order || 0,
        tabId: tabId || null,
        isActive: isActive !== undefined ? isActive : true,
        publishStatus: publishStatus || "DRAFT"
      }
    });

    return NextResponse.json(createSuccessResponse(member));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(`Failed to update member: ${error instanceof Error ? error.message : 'Unknown error'}`, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.member.update({
    where: { id },
    data: { isActive: false }
  });

  return NextResponse.json(createSuccessResponse({ success: true }));
});