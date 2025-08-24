import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!project) {
      return NextResponse.json(createErrorResponse("Project not found", "PROJECT_NOT_FOUND"), { status: 404 });
    }

    return NextResponse.json(createSuccessResponse(project));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  const body = await req.json();
  const { title, description, href, status, year, quarterly, fund } = body;

  if (!title || !description || !status || !year || !quarterly) {
    return NextResponse.json(
      createErrorResponse("Missing required fields", "MISSING_FIELDS"),
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

  return NextResponse.json(createSuccessResponse(project));
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  
  await prisma.project.delete({
    where: { id }
  });

  return NextResponse.json(createSuccessResponse({ message: "Project deleted successfully" }));
}); 