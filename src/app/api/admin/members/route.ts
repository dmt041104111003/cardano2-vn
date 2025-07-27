import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, role, description, image, email, color, skills, order } = await request.json();

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
        isActive: true
      }
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
} 