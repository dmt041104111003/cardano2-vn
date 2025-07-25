import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "~/lib/prisma";
import cloudinary from '~/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const sessionUser = session?.user as { address?: string };
    const address = searchParams.get("address") || sessionUser?.address;

    if (!address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { wallet: address },
      include: { role: true },
    });

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

    await prisma.session.updateMany({
      where: { userId: user.id },
      data: { lastAccess: new Date() }
    });

    const isAdmin = user.role.name === "ADMIN";

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        address: user.wallet,
        role: user.role.name,
        isAdmin: isAdmin,
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 