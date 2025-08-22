import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  const deleted = await prisma.videoSection.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, deleted });
});

export const PATCH = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const { isFeatured } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
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

  return NextResponse.json(updated);
});