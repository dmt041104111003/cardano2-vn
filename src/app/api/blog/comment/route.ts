import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const address = (session?.user as { address?: string })?.address;
  if (!session?.user || !address) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { postId, content, parentCommentId } = await req.json();
  if (!postId || !content || !content.trim()) {
    return NextResponse.json({ error: "Missing postId or content" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { wallet: address } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const comment = await prisma.comment.create({
    data: {
      postId,
      userId: user.id,
      content,
      parentCommentId: parentCommentId || undefined,
      isApproved: true,
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json({
    id: comment.id,
    content: comment.content,
    userId: comment.userId,
    address: comment.user ? comment.user.wallet : null,
    createdAt: comment.createdAt,
    parentCommentId: comment.parentCommentId || null,
  });
} 