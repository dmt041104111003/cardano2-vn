import { NextRequest, NextResponse } from "next/server";
import { withOptionalAuth } from "~/lib/api-wrapper";
import { prisma } from "~/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withOptionalAuth(async (req: NextRequest, user) => {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address");
  const email = searchParams.get("email");

  if (!address && !email) {
    return NextResponse.json(createErrorResponse("Address or email required", "MISSING_PARAMS"), { status: 400 });
  }

  try {
    let dbUser = null;
    
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

    if (!dbUser) {
      return NextResponse.json(createErrorResponse("User not found", "USER_NOT_FOUND"), { status: 404 });
    }

    return NextResponse.json(createSuccessResponse(dbUser));
  } catch (error) {
    return NextResponse.json(createErrorResponse("Internal server error", "INTERNAL_ERROR"), { status: 500 });
  }
});
