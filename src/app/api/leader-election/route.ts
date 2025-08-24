import { NextRequest, NextResponse } from 'next/server';
import { handleLeaderElectionAPI } from '~/lib/leader-election';

export async function POST(req: NextRequest) {
  return handleLeaderElectionAPI(req);
}

export async function GET(req: NextRequest) {
  try {
    const { getLeaderElection } = await import('~/lib/leader-election');
    const leaderElection = getLeaderElection();
    
    if (!leaderElection) {
      return NextResponse.json({ 
        error: 'Leader election not initialized',
        status: 'not_initialized'
      }, { status: 500 });
    }

    const clusterState = leaderElection.getClusterState();
    const serverInfo = leaderElection.getServerInfo();
    
    return NextResponse.json({
      status: 'active',
      server: serverInfo,
      cluster: clusterState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      status: 'error'
    }, { status: 500 });
  }
}
