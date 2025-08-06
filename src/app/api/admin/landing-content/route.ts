import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const landingContents = await prisma.landingContent.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(landingContents);
  } catch (error) {
    console.error('Error fetching landing content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landing content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as { address?: string; email?: string };
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: sessionUser.email },
          { wallet: sessionUser.address }
        ]
      },
      include: {
        role: true
      }
    });

    if (!user || user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Received body:', body);
    
    const {
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
    } = body;

    if (!section) {
      return NextResponse.json({ error: 'Section is required' }, { status: 400 });
    }

    const existingContent = await prisma.landingContent.findUnique({
      where: { section }
    });

    const data: any = {
      title,
      subtitle,
      description,
      mainText,
      subText,
    };

    console.log('Media URLs received:', { media1Url, media2Url, media3Url, media4Url });

    if (media1Url && media1Url.trim() !== '') data.media1Url = media1Url;
    if (media2Url && media2Url.trim() !== '') data.media2Url = media2Url;
    if (media3Url && media3Url.trim() !== '') data.media3Url = media3Url;
    if (media4Url && media4Url.trim() !== '') data.media4Url = media4Url;

    console.log('Final data to save:', data);

    if (existingContent) {
      const updatedContent = await prisma.landingContent.update({
        where: { id: existingContent.id },
        data,
      });

      return NextResponse.json(updatedContent);
    } else {
      const newContent = await prisma.landingContent.create({
        data: {
          section,
          ...data,
        },
      });

      return NextResponse.json(newContent);
    }
  } catch (error) {
    console.error('Error saving landing content:', error);
    return NextResponse.json(
      { error: 'Failed to save landing content' },
      { status: 500 }
    );
  }
} 