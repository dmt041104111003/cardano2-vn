import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
  try {
    const videos = await prisma.videoSection.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/videos error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { videoUrl, title, channelName } = body;

  if (!videoUrl) {
    return NextResponse.json({ error: "Missing videoUrl" }, { status: 400 });
  }

  if (!title || !channelName) {
    return NextResponse.json({ error: "Missing title or channelName" }, { status: 400 });
  }

  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  const existing = await prisma.videoSection.findFirst({
    where: { videoUrl },
  });

  if (existing) {
    return NextResponse.json({ error: "Video already exists" }, { status: 409 });
  }

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  const video = await prisma.videoSection.create({
    data: {
      videoId,
      channelName,
      videoUrl,
      title,
      thumbnailUrl,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(video);
});

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
