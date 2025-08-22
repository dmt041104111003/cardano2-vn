import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const PUT = withAdmin(async (req, user) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const body = await req.json();
  const { section, title, subtitle, description, mainText, subText, media1Url, media2Url, media3Url, media4Url } = body;

  if (!section) {
    return NextResponse.json({ error: 'Section is required' }, { status: 400 });
  }

  const existingContent = await prisma.landingContent.findFirst({
    where: {
      section,
      id: { not: id }
    }
  });

  if (existingContent) {
    return NextResponse.json({ error: 'Section already exists' }, { status: 400 });
  }

  const updatedContent = await prisma.landingContent.update({
    where: { id },
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
    },

  });

  return NextResponse.json(updatedContent);
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await prisma.landingContent.update({
    where: { id },
    data: { isActive: false }
  });

  return NextResponse.json({ success: true });
}); 