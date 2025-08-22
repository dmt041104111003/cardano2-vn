import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ technologies });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { title, name, description, href, image, githubRepo } = body;

  const technology = await prisma.technology.create({
    data: {
      title,
      name,
      description,
      href,
      image,
      githubRepo: githubRepo || null,
    },
  });

  return NextResponse.json({ technology });
}); 