import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        publishStatus: 'PUBLISHED'
      },
      orderBy: [
        { year: 'desc' },
        { quarterly: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(createSuccessResponse(projects));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse("Internal server error", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
} 