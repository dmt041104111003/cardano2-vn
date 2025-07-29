import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    // @ts-ignore
    const videos = await prisma.VideoSection.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/video-section error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

