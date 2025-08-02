import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import { authOptions } from "../../[...nextauth]/route";

const sessionUpdateCache = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000;

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { address?: string; email?: string };
    const address = sessionUser?.address;
    const email = sessionUser?.email;

    if (!address && !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIdentifier = address || email;
    const now = Date.now();
    
    if (userIdentifier) {
      const lastUpdate = sessionUpdateCache.get(userIdentifier);
      if (lastUpdate && (now - lastUpdate) < CACHE_DURATION) {
        return NextResponse.json({
          success: true,
          cached: true,
          message: "Session recently updated"
        });
      }
    }

    let user = null;
    if (address) {
      user = await prisma.user.findUnique({
        where: { wallet: address },
        select: { id: true }
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email },
        select: { id: true } // Chỉ select id để tối ưu
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id }
    });

    let updatedSession;
    if (existingSession) {
      updatedSession = await prisma.session.update({
        where: { id: existingSession.id },
        data: {
          lastAccess: new Date(),
        },
      });
    } else {
      updatedSession = await prisma.session.create({
        data: {
          userId: user.id,
          accessTime: new Date(),
          lastAccess: new Date(),
        },
      });
    }

    if (userIdentifier) {
      sessionUpdateCache.set(userIdentifier, now);
    }

    return NextResponse.json({
      success: true,
      lastAccess: updatedSession.lastAccess,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 