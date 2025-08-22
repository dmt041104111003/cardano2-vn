import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  const body = await req.json();
  const { title, description, href, status, year, quarterly, fund } = body;

  if (!title || !description || !status || !year || !quarterly) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const project = await prisma.project.update({
    where: { id },
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

  return NextResponse.json({ project });
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  
  await prisma.project.delete({
    where: { id }
  });

  return NextResponse.json({ message: "Project deleted successfully" });
}); 