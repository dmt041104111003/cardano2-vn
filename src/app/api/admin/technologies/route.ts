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
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  try {
    const body = await req.json();    
    const { title, name, description, href, image, githubRepo, publishStatus, featureCardIds } = body;

    if (!title || !name || !description || !href || !publishStatus) {
      return NextResponse.json(createErrorResponse('Missing required fields', 'MISSING_FIELDS'), { status: 400 });
    }

    const technology = await prisma.technology.create({
      data: {
        title,
        name,
        description,
        href,
        image,
        githubRepo: githubRepo || null,
        publishStatus,
        featureCardIds: featureCardIds || [],
      },
    });
    return NextResponse.json(createSuccessResponse(technology));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Failed to create technology', 'CREATE_FAILED'), { status: 500 });
  }
}); 