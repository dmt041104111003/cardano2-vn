import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const technology = await prisma.technology.findUnique({
      where: { id: params.id }
    });

    if (!technology) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    return NextResponse.json(technology);
  } catch (error) {
    console.error('Error fetching technology:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const body = await req.json();
  const { title, name, description, href, image, githubRepo } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const existingTechnology = await prisma.technology.findFirst({
    where: {
      name,
      id: { not: id }
    }
  });

  if (existingTechnology) {
    return NextResponse.json({ error: 'Technology name already exists' }, { status: 400 });
  }

  const updatedTechnology = await prisma.technology.update({
    where: { id },
    data: {
      title,
      name,
      description,
      href,
      image,
      githubRepo: githubRepo || null
    }
  });

  return NextResponse.json(updatedTechnology);
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await prisma.technology.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}); 