import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const aboutContent = await prisma.aboutContent.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ aboutContent });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, subtitle, description, youtubeUrl, buttonText, buttonUrl } = await request.json();

    const existingContent = await prisma.aboutContent.findFirst({
      where: { isActive: true }
    });

    if (existingContent) {
      const aboutContent = await prisma.aboutContent.update({
        where: { id: existingContent.id },
        data: {
          title,
          subtitle,
          description,
          youtubeUrl,
          buttonText,
          buttonUrl,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ aboutContent });
    } else {
      const aboutContent = await prisma.aboutContent.create({
        data: {
          title,
          subtitle,
          description,
          youtubeUrl,
          buttonText,
          buttonUrl,
          isActive: true
        }
      });

      return NextResponse.json({ aboutContent });
    }
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
} 