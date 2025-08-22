import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

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
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
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

  return NextResponse.json({ member });
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await prisma.member.update({
    where: { id },
    data: { isActive: false }
  });

  return NextResponse.json({ success: true });
});