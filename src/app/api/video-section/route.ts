import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createErrorResponse } from "~/lib/api-response";
import { createSuccessResponse } from "~/lib/api-response";

export async function GET() {
  try {
    const videos = await prisma.videoSection.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(createSuccessResponse(videos));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Failed to fetch videos', 'FAILED_TO_FETCH_VIDEOS'), { status: 500 });
  }
}

