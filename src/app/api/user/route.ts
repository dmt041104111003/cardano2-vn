import { NextRequest, NextResponse } from "next/server";
import { withOptionalAuth } from "~/lib/api-wrapper";
import { prisma } from "~/lib/prisma";

export const GET = withOptionalAuth(async (req: NextRequest, user) => {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address");
  const email = searchParams.get("email");

  if (!address && !email) {
    return NextResponse.json({ error: "Address or email required" }, { status: 400 });
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
