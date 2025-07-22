import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession();
    const sessionUser = session?.user as { address?: string };
    const address = sessionUser?.address;

    if (!address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { wallet: address },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedSession = await prisma.session.upsert({
      where: {
        userId: user.id,
        id: user.id,
      },
      update: {
        lastAccess: new Date(),
      },
      create: {
        userId: user.id,
        accessTime: new Date(),
        lastAccess: new Date(),
      },
    });

    console.log(`[Session] Updated lastAccess for user ${user.wallet}:`, updatedSession.lastAccess);

    return NextResponse.json({
      success: true,
      lastAccess: updatedSession.lastAccess,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 