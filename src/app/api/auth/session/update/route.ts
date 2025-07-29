import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import { authOptions } from "../../[...nextauth]/route";

export async function POST() {
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

    return NextResponse.json({
      success: true,
      lastAccess: updatedSession.lastAccess,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 