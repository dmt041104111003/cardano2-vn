import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
  try {
    const content = await prisma.landingContent.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { section, title, subtitle, description, mainText, subText, media1Url, media2Url, media3Url, media4Url } = await req.json();
  
  if (!section) {
    return NextResponse.json({ error: 'Section is required' }, { status: 400 });
  }
  
  const existingContent = await prisma.landingContent.findFirst({
    where: { section }
  });
  
  if (existingContent) {
    return NextResponse.json({ error: 'Section already exists' }, { status: 409 });
  }
  
  const content = await prisma.landingContent.create({
    data: {
      section,
      title,
      subtitle,
      description,
      mainText,
      subText,
      media1Url,
      media2Url,
      media3Url,
      media4Url
    }
  });
  
  return NextResponse.json({ content });
}); 