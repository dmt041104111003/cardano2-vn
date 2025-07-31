import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const technology = await prisma.technology.findUnique({
      where: { id: params.id },
    });

    if (!technology) {
      return NextResponse.json({ error: "Technology not found" }, { status: 404 });
    }

    return NextResponse.json({ technology });
  } catch (error) {
    console.error("Error fetching technology:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, name, description, href, image, githubRepo } = body;

    const technology = await prisma.technology.update({
      where: { id: params.id },
      data: {
        title,
        name,
        description,
        href,
        image,
        githubRepo: githubRepo || null,
      },
    });

    return NextResponse.json({ technology });
  } catch (error) {
    console.error("Error updating technology:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.technology.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Technology deleted successfully" });
  } catch (error) {
    console.error("Error deleting technology:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 