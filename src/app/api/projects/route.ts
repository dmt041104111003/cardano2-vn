import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { year: 'desc' },
        { quarterly: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(createSuccessResponse(projects));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      createErrorResponse("Internal server error", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
} 