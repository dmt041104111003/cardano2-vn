import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { address?: string; email?: string };
  

  
  if (!session?.user || (!sessionUser.address && !sessionUser.email)) {
    console.log('Unauthorized - no session or no address/email');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Support all 3 providers: Google, GitHub, Cardano
  let user = null;
  if (sessionUser.address) {
    console.log('Looking up user by address:', sessionUser.address);
    user = await prisma.user.findUnique({ where: { wallet: sessionUser.address } });
  } else if (sessionUser.email) {
    console.log('Looking up user by email:', sessionUser.email);
    user = await prisma.user.findUnique({ where: { email: sessionUser.email } });
  }
  
  console.log('Found user:', JSON.stringify(user, null, 2));
  
  if (!user) {
    console.log('User not found');
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  const { postId, type } = await req.json();
  console.log('Reaction data:', { postId, type });
  
  if (!postId || !type) {
    console.log('Missing postId or type');
    return NextResponse.json({ error: "Missing postId or type" }, { status: 400 });
  }

  let actualPostId = postId;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (postId && !uuidRegex.test(postId)) {
    console.log('Looking for post by slug:', postId);
    const post = await prisma.post.findUnique({
      where: { slug: postId },
      select: { id: true }
    });
    console.log('Found post by slug:', post);
    if (post) {
      actualPostId = post.id;
      console.log('Converted slug to postId:', { slug: postId, actualPostId });
    } else {
      console.log('Post not found by slug:', postId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  }

  try {
    await prisma.reaction.deleteMany({
      where: {
        userId: user.id,
        postId: actualPostId,
      },
    });

    const reaction = await prisma.reaction.create({
      data: {
        userId: user.id,
        postId: actualPostId,
        type,
      },
    });
    
    console.log('Reaction created successfully:', reaction);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json({ error: "Failed to create reaction" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const me = req.nextUrl.searchParams.get("me");
  if (me === "1") {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { address?: string; email?: string };
    
    console.log('=== REACTION GET DEBUG ===');
    console.log('Session:', JSON.stringify(session, null, 2));
    console.log('Session user:', JSON.stringify(sessionUser, null, 2));
    
    if (!session?.user || (!sessionUser.address && !sessionUser.email)) {
      console.log('No session or no address/email for GET');
      return NextResponse.json({ currentUserReaction: null });
    }
    
    // Support all 3 providers: Google, GitHub, Cardano
    let user = null;
    if (sessionUser.address) {
      console.log('Looking up user by address for GET:', sessionUser.address);
      user = await prisma.user.findUnique({ where: { wallet: sessionUser.address } });
    } else if (sessionUser.email) {
      console.log('Looking up user by email for GET:', sessionUser.email);
      user = await prisma.user.findUnique({ where: { email: sessionUser.email } });
    }
    
    console.log('Found user for GET:', JSON.stringify(user, null, 2));
    
    if (!user) {
      console.log('User not found for GET');
      return NextResponse.json({ currentUserReaction: null });
    }
    
    let actualPostId = postId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (postId && !uuidRegex.test(postId)) {
      console.log('Looking for post by slug:', postId);
      const post = await prisma.post.findUnique({
        where: { slug: postId },
        select: { id: true }
      });
      console.log('Found post by slug:', post);
      if (post) {
        actualPostId = post.id;
        console.log('Converted slug to postId:', { slug: postId, actualPostId });
      } else {
        console.log('Post not found by slug:', postId);
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    }

    const reaction = await prisma.reaction.findFirst({
      where: { userId: user.id, postId: actualPostId },
      select: { type: true },
    });
    
    console.log('Found reaction:', reaction);
    return NextResponse.json({ currentUserReaction: reaction?.type || null });
  }

  let actualPostId = postId;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (postId && !uuidRegex.test(postId)) {
    console.log('Looking for post by slug (GET all):', postId);
    const post = await prisma.post.findUnique({
      where: { slug: postId },
      select: { id: true }
    });
    console.log('Found post by slug (GET all):', post);
    if (post) {
      actualPostId = post.id;
      console.log('Converted slug to postId (GET all):', { slug: postId, actualPostId });
    } else {
      console.log('Post not found by slug (GET all):', postId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  }

  const reactions = await prisma.reaction.findMany({
    where: { postId: actualPostId },
    select: { type: true },
  });
  const counts: { [type: string]: number } = {};
  reactions.forEach(r => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });
  return NextResponse.json({ reactions: counts });
} 