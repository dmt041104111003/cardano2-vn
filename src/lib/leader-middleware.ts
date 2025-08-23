import { NextRequest, NextResponse } from 'next/server';
import { isLeader } from './leader-election';

interface LeaderMiddlewareOptions {
  requireLeader?: boolean;
  redirectToLeader?: boolean;
  fallbackUrl?: string;
}

export function withLeaderCheck(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: LeaderMiddlewareOptions = {}
) {
  return async (req: NextRequest) => {
    const { requireLeader = false, redirectToLeader = false, fallbackUrl } = options;
    const leaderElectionEnabled = process.env.LEADER_ELECTION_ENABLED === 'true';
    
    if (!leaderElectionEnabled) {
      return await handler(req);
    }
    
    const isCurrentLeader = isLeader();
    
    if (requireLeader && !isCurrentLeader) {
      if (redirectToLeader && fallbackUrl) {
        const leaderUrl = new URL(fallbackUrl);
        leaderUrl.pathname = req.nextUrl.pathname;
        leaderUrl.search = req.nextUrl.search;
        
        return NextResponse.redirect(leaderUrl);
      } else {
        return NextResponse.json({
          error: 'This operation requires leader server',
          code: 'LEADER_REQUIRED',
          message: 'Please contact the leader server for this operation'
        }, { status: 503 });
      }
    }
    
    const response = await handler(req);
    response.headers.set('X-Server-Leader', isCurrentLeader ? 'true' : 'false');
    response.headers.set('X-Server-ID', process.env.SERVER_ID || 'unknown');
    
    return response;
  };
}

export function withAdminLeaderCheck(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withLeaderCheck(handler, {
    requireLeader: true,
    redirectToLeader: true,
    fallbackUrl: process.env.NEXTAUTH_URL
  });
}

export function withReadOperation(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withLeaderCheck(handler, {
    requireLeader: false
  });
}

export function withWriteOperation(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withLeaderCheck(handler, {
    requireLeader: true,
    redirectToLeader: true,
    fallbackUrl: process.env.NEXTAUTH_URL
  });
}
