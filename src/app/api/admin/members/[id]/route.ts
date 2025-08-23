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
    console.error('Error fetching member:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch member', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  const { name, role, description, image, email, color, skills, order, tabId, isActive } = await req.json();

  const member = await prisma.member.update({
    where: { id },
    data: {
      name,
      role,
      description,
      image,
      email,
      color,
      skills,
      order,
      tabId,
      isActive
    }
  });

  return NextResponse.json(createSuccessResponse(member));
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