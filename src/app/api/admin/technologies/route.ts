import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(createSuccessResponse(technologies));
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
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

  return NextResponse.json(createSuccessResponse(technology));
}); 