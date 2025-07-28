import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

// DELETE /api/admin/video-section/[id]
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  try {
    const deleted = await prisma.videoSection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE /api/admin/video-section/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}

// PATCH /api/admin/video-section/[id]
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const { isFeatured, isSlideshow } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  try {
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
        ...(isSlideshow !== undefined && { isSlideshow }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/video-section/[id] error:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}
