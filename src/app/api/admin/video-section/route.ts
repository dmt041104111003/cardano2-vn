import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
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
}

export async function POST(req: Request) {
  const body = await req.json();
  const { videoUrl } = body;

  if (!videoUrl) {
    return NextResponse.json({ error: "Missing videoUrl" }, { status: 400 });
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

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const apiUrl = `https://youtube138.p.rapidapi.com/video/details/?id=${videoId}`;

  const res = await fetch(apiUrl, {
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY!,
      "x-rapidapi-host": "youtube138.p.rapidapi.com",
    },
  });

  const data = await res.json();

  if (!data.title) {
    console.error("Failed to fetch video info:", data);
    return NextResponse.json({ error: "Failed to fetch video info" }, { status: 400 });
  }

  const title = data.title;
  const thumbnailUrl = data.thumbnails?.[data.thumbnails.length - 1]?.url || "";

  const video = await prisma.videoSection.create({
    data: {
      videoId,
      channelName: data.author?.title || "Unknown Channel",
      videoUrl,
      title,
      thumbnailUrl,
      isFeatured: false,
      isSlideshow: false,
    },
  });

  return NextResponse.json(video);
}

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
