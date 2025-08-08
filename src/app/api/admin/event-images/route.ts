import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { prisma } from "~/lib/prisma";
import { uploadImageFromFile } from "~/lib/uploadImage";

export async function GET() {
  try {
    const images = await prisma.eventImages.findMany({
      orderBy: [{ orderNumber: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("GET event images error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = session.user as { address?: string; email?: string };
    let user = null;

    if (sessionUser.address) {
      user = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true },
      });
    } else if (sessionUser.email) {
      user = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.role.name !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const location = formData.get("location") as string;
    const title = formData.get("title") as string;

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const res = await uploadImageFromFile(file);
    const imageUrl = res.url;
    const publicId = res.publicId;
    const orderNumber = parseInt(formData.get("order") as string, 10) || 0;

    const newImage = await prisma.eventImages.create({
      data: {
        location,
        title, // Corrected from tittle to title
        imageUrl,
        publicId,
        orderNumber,
      },
    });

    return NextResponse.json({
      message: "Image uploaded and saved",
      media: {
        url: imageUrl,
        public_id: publicId,
        type: "IMAGE",
      },
      eventImage: newImage,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}