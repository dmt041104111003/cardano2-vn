import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createErrorResponse } from "~/lib/api-response";
import { createSuccessResponse } from "~/lib/api-response";

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(createErrorResponse('Missing video ID', 'MISSING_VIDEO_ID'), { status: 400 });
  }

  const deleted = await prisma.videoSection.delete({
    where: { id },
  });

  return NextResponse.json(createSuccessResponse({ success: true, deleted }));
});

export const PATCH = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const { isFeatured } = body;

  if (!id) {
    return NextResponse.json(createErrorResponse('Missing video ID', 'MISSING_VIDEO_ID'), { status: 400 });
  }

  if (isFeatured === true) {
    const existingFeatured = await prisma.videoSection.findFirst({
      where: {
        isFeatured: true,
        NOT: { id },
      },
    });

    if (existingFeatured) {
      await prisma.videoSection.update({
        where: { id: existingFeatured.id },
        data: { isFeatured: false },
      });
    }
  }

  const updated = await prisma.videoSection.update({
    where: { id },
    data: {
      ...(isFeatured !== undefined && { isFeatured }),
    },
  });

  return NextResponse.json(createSuccessResponse(updated));
});