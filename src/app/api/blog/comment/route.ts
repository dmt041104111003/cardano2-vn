import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { address?: string; email?: string };
  if (!session?.user || (!sessionUser.address && !sessionUser.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Support all 3 providers: Google, GitHub, Cardano
  let user = null;
  if (sessionUser.address) {
    user = await prisma.user.findUnique({ where: { wallet: sessionUser.address } });
  } else if (sessionUser.email) {
    user = await prisma.user.findUnique({ where: { email: sessionUser.email } });
  }
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  const { postId, content, parentCommentId } = await req.json();
  if (!postId || !content || !content.trim()) {
    return NextResponse.json({ error: "Missing postId or content" }, { status: 400 });
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

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { address?: string; email?: string };
  if (!session?.user || (!sessionUser.address && !sessionUser.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Support all 3 providers: Google, GitHub, Cardano
  let user = null;
  if (sessionUser.address) {
    user = await prisma.user.findUnique({ where: { wallet: sessionUser.address }, include: { role: true } });
  } else if (sessionUser.email) {
    user = await prisma.user.findUnique({ where: { email: sessionUser.email }, include: { role: true } });
  }
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing comment id" }, { status: 400 });
  }
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  const isUserAdmin = user.role.name === "ADMIN";
  if (!isUserAdmin && comment.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { address?: string; email?: string };
  if (!session?.user || (!sessionUser.address && !sessionUser.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Support all 3 providers: Google, GitHub, Cardano
  let user = null;
  if (sessionUser.address) {
    user = await prisma.user.findUnique({ where: { wallet: sessionUser.address } });
  } else if (sessionUser.email) {
    user = await prisma.user.findUnique({ where: { email: sessionUser.email } });
  }
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  const { id, content } = await req.json();
  if (!id || !content || !content.trim()) {
    return NextResponse.json({ error: "Missing id or content" }, { status: 400 });
  }
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
  });
  return NextResponse.json({ success: true, comment: updated });
} 