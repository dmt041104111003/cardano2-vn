import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { year: 'desc' },
        { quarterly: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 