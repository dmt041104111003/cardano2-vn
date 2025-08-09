import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { prisma } from "~/lib/prisma";
import cloudinary from "~/lib/cloudinary";
import { uploadImageFromFile } from "~/lib/uploadImage";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ wallet: (session.user as any).address }, { email: (session.user as any).email }],
      },
      include: { role: true },
    });

    if (!user || user.role.name !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const currentImage = await prisma.eventImages.findUnique({
      where: { id },
    });

    if (!currentImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No valid image file provided" }, { status: 400 });
    }

    if (currentImage.publicId) {
      await cloudinary.uploader.destroy(currentImage.publicId);
    }

    const uploadRes = await uploadImageFromFile(file);

    const updatedImage = await prisma.eventImages.update({
      where: { id },
      data: {
        location,
        title,
        imageUrl: uploadRes.url,
        publicId: uploadRes.publicId,
      },
    });

    return NextResponse.json({
      message: "Image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    console.error("Update image error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
