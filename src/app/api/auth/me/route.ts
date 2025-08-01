import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import cloudinary from '~/lib/cloudinary';
import { authOptions } from "../[...nextauth]/route";

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

    let user = null;
    if (address) {
      user = await prisma.user.findUnique({
        where: { wallet: address },
        include: { role: true },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email },
        include: { role: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.image && user.image.startsWith('data:image')) {
      const uploadRes = await cloudinary.uploader.upload(user.image, { resource_type: 'image' });
      await prisma.user.update({
        where: { id: user.id },
        data: { image: uploadRes.url },
      });
      user.image = uploadRes.url;
    }

    const isAdmin = user.role.name === "ADMIN";

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        address: user.wallet,
        email: user.email,
        provider: user.provider,
        role: user.role.name,
        isAdmin: isAdmin,
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 