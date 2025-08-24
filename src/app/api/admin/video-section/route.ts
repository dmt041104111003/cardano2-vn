import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createErrorResponse } from "~/lib/api-response";
import { createSuccessResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
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
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { videoUrl, title, channelName } = body;

  if (!videoUrl) {
    return NextResponse.json(createErrorResponse('Missing videoUrl', 'MISSING_VIDEO_URL'), { status: 400 });
  }

  if (!title || !channelName) {
    return NextResponse.json(createErrorResponse('Missing title or channelName', 'MISSING_TITLE_OR_CHANNEL_NAME'), { status: 400 });
  }

  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    return NextResponse.json(createErrorResponse('Invalid YouTube URL', 'INVALID_YOUTUBE_URL'), { status: 400 });
  }

  const existing = await prisma.videoSection.findFirst({
    where: { videoUrl },
  });

  if (existing) {
    return NextResponse.json(createErrorResponse('Video already exists', 'VIDEO_ALREADY_EXISTS'), { status: 409 });
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

  return NextResponse.json(createSuccessResponse(video) );
});

function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
