import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const technologies = await prisma.technology.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ technologies });
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, name, description, href, image } = body;

    const technology = await prisma.technology.create({
      data: {
        title,
        name,
        description,
        href,
        image,
      },
    });

    return NextResponse.json({ technology });
  } catch (error) {
    console.error("Error creating technology:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 