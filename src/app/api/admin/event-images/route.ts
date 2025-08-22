import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
  try {
    const images = await prisma.eventImages.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { location, title, imageUrl, publicId } = await req.json();
  
  if (!location || !title || !imageUrl || !publicId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const image = await prisma.eventImages.create({
    data: { location, title, imageUrl, publicId }
  });
  
  return NextResponse.json({ image });
});
