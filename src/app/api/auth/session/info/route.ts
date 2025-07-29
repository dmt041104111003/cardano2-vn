import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import { authOptions } from "../../[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { address?: string; email?: string };
    const address = sessionUser?.address;
    const email = sessionUser?.email;

    if (!address && !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = null;
    if (address) {
      user = await prisma.user.findUnique({
        where: { wallet: address },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userSession = await prisma.session.findFirst({
      where: { userId: user.id },
      orderBy: { lastAccess: "desc" },
    });

    if (!userSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      session: {
        id: userSession.id,
        accessTime: userSession.accessTime,
        lastAccess: userSession.lastAccess,
      }
    });
  } catch (error) {
    console.error("Error fetching session info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 