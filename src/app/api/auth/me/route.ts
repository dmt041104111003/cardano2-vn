import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import { authOptions } from "../[...nextauth]/route";

const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const sessionUser = session?.user as { address?: string; email?: string };
    const address = searchParams.get("address") || sessionUser?.address;
    const email = searchParams.get("email") || sessionUser?.email;

    if (!address && !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIdentifier = address || email;
    const now = Date.now();

    if (userIdentifier) {
      const cached = userCache.get(userIdentifier);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return NextResponse.json({ user: cached.data });
      }
    }

    let user = null;
    if (address) {
      user = await prisma.user.findUnique({
        where: { wallet: address },
        select: {
          id: true,
          name: true,
          image: true,
          wallet: true,
          email: true,
          provider: true,
          role: {
            select: {
              name: true
            }
          }
        }
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email },
        select: {
          id: true,
          name: true,
          image: true,
          wallet: true,
          email: true,
          provider: true,
          role: {
            select: {
              name: true
            }
          }
        }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Bỏ Cloudinary upload ra khỏi API này - chuyển sang background job
    // if (user.image && user.image.startsWith('data:image')) {
    //   const uploadRes = await cloudinary.uploader.upload(user.image, { resource_type: 'image' });
    //   await prisma.user.update({
    //     where: { id: user.id },
    //     data: { image: uploadRes.url },
    //   });
    //   user.image = uploadRes.url;
    // }

    const userData = {
      id: user.id,
      name: user.name,
      image: user.image,
      address: user.wallet,
      email: user.email,
      provider: user.provider,
      role: user.role.name,
      isAdmin: user.role.name === "ADMIN",
    };

    if (userIdentifier) {
      userCache.set(userIdentifier, { data: userData, timestamp: now });
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 