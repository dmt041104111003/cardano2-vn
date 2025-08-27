import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAuth, withOptionalAuth } from "~/lib/api-wrapper";
import { createErrorResponse, createSuccessResponse } from "~/lib/api-response";

export const POST = withAuth(async (req, user) => {
  if (!user) {
    return NextResponse.json(createErrorResponse('User not found', 'USER_NOT_FOUND'), { status: 404 });
  }
  
  const { postId, type } = await req.json();
  
  if (!postId || !type) {
    return NextResponse.json(createErrorResponse('Missing postId or type', 'MISSING_POST_ID_OR_TYPE'), { status: 400 });
  }

  let actualPostId = postId;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (postId && !uuidRegex.test(postId)) {
    const post = await prisma.post.findUnique({
      where: { slug: postId },
      select: { id: true }
    });
    if (post) {
      actualPostId = post.id;
    } else {
      return NextResponse.json(createErrorResponse('Post not found', 'POST_NOT_FOUND'), { status: 404 });
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
    
    return NextResponse.json(createSuccessResponse({ success: true }));
  } catch (error: any) {    
    if (error.code === 'P2002') {
      return NextResponse.json(createSuccessResponse({ success: true }));
    }
    
    return NextResponse.json(createErrorResponse('Failed to create reaction', 'FAILED_TO_CREATE_REACTION'), { status: 500 });
  }
});

export const GET = withOptionalAuth(async (req, user) => {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json(createErrorResponse('Missing postId', 'MISSING_POST_ID'), { status: 400 });
  }

  const me = req.nextUrl.searchParams.get("me");
  if (me === "1") {
    if (!user) {
      return NextResponse.json(createSuccessResponse({ currentUserReaction: null }));
    }
    
    let actualPostId = postId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (postId && !uuidRegex.test(postId)) {
      const post = await prisma.post.findUnique({
        where: { slug: postId },
        select: { id: true }
      });
      if (post) {
        actualPostId = post.id;
      } else {
        return NextResponse.json(createErrorResponse('Post not found', 'POST_NOT_FOUND'), { status: 404 });
      }
    }

    const reaction = await prisma.reaction.findFirst({
      where: { userId: user.id, postId: actualPostId },
      select: { type: true },
    });
    
    return NextResponse.json(createSuccessResponse({ currentUserReaction: reaction?.type || null }));
  }

  let actualPostId = postId;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (postId && !uuidRegex.test(postId)) {
    const post = await prisma.post.findUnique({
      where: { slug: postId },
      select: { id: true }
    });
    if (post) {
      actualPostId = post.id;
    } else {
      return NextResponse.json(createErrorResponse('Post not found', 'POST_NOT_FOUND'), { status: 404 });
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
  
  return NextResponse.json(createSuccessResponse({ reactions: counts }));
}); 