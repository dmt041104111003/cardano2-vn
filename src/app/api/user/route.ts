import { NextRequest, NextResponse } from "next/server";
import { withOptionalAuth } from "~/lib/api-wrapper";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withOptionalAuth(async (req: NextRequest, user) => {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address");
  const email = searchParams.get("email");

  try {
    let dbUser = null;
    
    if (!address && !email) {
      if (!user) {
        return NextResponse.json(createErrorResponse("Unauthorized", "UNAUTHORIZED"), { status: 401 });
      }
      
      return NextResponse.json(createSuccessResponse(user));
    } else {
      if (address) {
        dbUser = await prisma.user.findUnique({
          where: { wallet: address },
          include: { role: true }
        });
      } else if (email) {
        dbUser = await prisma.user.findUnique({
          where: { email: email },
          include: { role: true }
        });
      }
    }

    if (!dbUser) {
      return NextResponse.json(createErrorResponse("User not found", "USER_NOT_FOUND"), { status: 404 });
    }

    return NextResponse.json(createSuccessResponse(dbUser));
  } catch (error) {
    return NextResponse.json(createErrorResponse("Internal server error", "INTERNAL_ERROR"), { status: 500 });
  }
});

export const POST = withOptionalAuth(async (req: NextRequest, user) => {
  if (!user) {
    return NextResponse.json(createErrorResponse("Unauthorized", "UNAUTHORIZED"), { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(createErrorResponse("Name is required", "MISSING_NAME"), { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json(createErrorResponse("Name must be at least 2 characters", "INVALID_NAME_LENGTH"), { status: 400 });
    }

    if (name.trim().length > 50) {
      return NextResponse.json(createErrorResponse("Name cannot exceed 50 characters", "INVALID_NAME_LENGTH"), { status: 400 });
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { wallet: user.wallet },
          { email: user.email }
        ]
      }
    });

    if (!dbUser) {
      return NextResponse.json(createErrorResponse("User not found", "USER_NOT_FOUND"), { status: 404 });
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { name: name.trim() }
    });

    return NextResponse.json(createSuccessResponse({ message: "Name updated successfully" }));
  } catch (error) {
    return NextResponse.json(createErrorResponse("Internal server error", "INTERNAL_ERROR"), { status: 500 });
  }
});
