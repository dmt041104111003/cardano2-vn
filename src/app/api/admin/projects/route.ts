import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const GET = withAdmin(async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { year: 'desc' },
        { quarterly: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { title, description, href, status, year, quarterly, fund } = body;

  // Validate required fields
  if (!title || !description || !status || !year || !quarterly) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      href: href || null,
      status,
      year: parseInt(year),
      quarterly,
      fund: fund || null,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}); 