import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { year: 'desc' },
        { quarterly: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(createSuccessResponse(projects));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json();
  const { title, description, href, status, publishStatus, year, quarterly, fund } = body;

  if (!title || !description || !status || !publishStatus || !year || !quarterly) {
    return NextResponse.json(
      createErrorResponse("Missing required fields", "MISSING_FIELDS"),
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      href: href || null,
      status,
      publishStatus,
      year: parseInt(year),
      quarterly,
      fund: fund || null,
    },
  });

  return NextResponse.json(createSuccessResponse(project), { status: 201 });
}); 