import { NextRequest, NextResponse } from 'next/server';

interface ServerInfo {
  id: string;
  host: string;
  port: number;
  region: string;
  isLeader: boolean;
  lastHeartbeat: number;
}

interface ElectionMessage {
  type: 'ELECTION_START' | 'ELECTION_ACK' | 'LEADER_ANNOUNCEMENT' | 'HEARTBEAT';
  serverId: string;
  term: number;
  timestamp: number;
}

class APIServerLeaderElection {
  private serverId: string;
  private servers: ServerInfo[];
  private currentTerm: number = 0;
  private isLeader: boolean = false;
  private electionTimeout: number = 5000;
  private heartbeatInterval: number = 2000;
  private lastHeartbeat: number = Date.now();
  private electionTimer?: NodeJS.Timeout;
  private heartbeatTimer?: NodeJS.Timeout;

  constructor(serverId: string, servers: ServerInfo[]) {
    this.serverId = serverId;
    this.servers = servers;
    this.startElectionTimer();
  }

  private startElectionTimer() {
    this.electionTimer = setInterval(() => {
      if (!this.isLeader) {
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat;
        if (timeSinceLastHeartbeat > this.electionTimeout) {
          console.log(`[Server ${this.serverId}] Election timeout, starting election`);
          this.startElection();
        }
      }
    }, 1000);
  }

  private async startElection() {
    console.log(`[Server ${this.serverId}] Starting election for term ${this.currentTerm + 1}`);
    this.currentTerm++;
    
    const higherServers = this.servers.filter(s => s.id > this.serverId);
    
    if (higherServers.length === 0) {
      this.becomeLeader();
    } else {
      const responses = await Promise.allSettled(
        higherServers.map(server => this.sendElectionMessage(server, 'ELECTION_START'))
      );
      
      const hasHigherServerResponse = responses.some(
        response => response.status === 'fulfilled' && response.value
      );
      
      if (!hasHigherServerResponse) {
        this.becomeLeader();
      }
    }
  }

  private async sendElectionMessage(server: ServerInfo, type: ElectionMessage['type']): Promise<boolean> {
    try {
      const message: ElectionMessage = {
        type,
        serverId: this.serverId,
        term: this.currentTerm,
        timestamp: Date.now()
      };

      const response = await fetch(`http://${server.host}:${server.port}/api/leader-election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      return response.ok;
    } catch (error) {
      console.error(`[Server ${this.serverId}] Failed to send election message to ${server.id}:`, error);
      return false;
    }
  }

  private becomeLeader() {
    this.isLeader = true;
    console.log(`[Server ${this.serverId}] Became LEADER for term ${this.currentTerm}`);
    
    this.servers.forEach(server => {
      if (server.id !== this.serverId) {
        this.sendElectionMessage(server, 'LEADER_ANNOUNCEMENT');
      }
    });
    
    this.startHeartbeat();
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.servers.forEach(server => {
        if (server.id !== this.serverId) {
          this.sendElectionMessage(server, 'HEARTBEAT');
        }
      });
    }, this.heartbeatInterval);
  }

  public handleElectionMessage(message: ElectionMessage): ElectionMessage {
    switch (message.type) {
      case 'ELECTION_START':
        return this.handleElectionStart(message);
      case 'ELECTION_ACK':
        return this.handleElectionAck(message);
      case 'LEADER_ANNOUNCEMENT':
        return this.handleLeaderAnnouncement(message);
      case 'HEARTBEAT':
        return this.handleHeartbeat(message);
      default:
        return { type: 'ELECTION_ACK', serverId: this.serverId, term: this.currentTerm, timestamp: Date.now() };
    }
  }

  private handleElectionStart(message: ElectionMessage): ElectionMessage {
    if (message.term > this.currentTerm) {
      this.currentTerm = message.term;
      this.isLeader = false;
      this.lastHeartbeat = Date.now();
    }
    
    if (message.serverId !== this.serverId) {
      return {
        type: 'ELECTION_ACK',
        serverId: this.serverId,
        term: this.currentTerm,
        timestamp: Date.now()
      };
    }
    
    return { type: 'ELECTION_ACK', serverId: this.serverId, term: this.currentTerm, timestamp: Date.now() };
  }

  private handleElectionAck(message: ElectionMessage): ElectionMessage {
    this.lastHeartbeat = Date.now();
    return { type: 'ELECTION_ACK', serverId: this.serverId, term: this.currentTerm, timestamp: Date.now() };
  }

  private handleLeaderAnnouncement(message: ElectionMessage): ElectionMessage {
    if (message.term >= this.currentTerm) {
      this.currentTerm = message.term;
      this.isLeader = false;
      this.lastHeartbeat = Date.now();
      console.log(`[Server ${this.serverId}] Acknowledged ${message.serverId} as leader`);
    }
    
    return { type: 'ELECTION_ACK', serverId: this.serverId, term: this.currentTerm, timestamp: Date.now() };
  }

  private handleHeartbeat(message: ElectionMessage): ElectionMessage {
    this.lastHeartbeat = Date.now();
    return { type: 'ELECTION_ACK', serverId: this.serverId, term: this.currentTerm, timestamp: Date.now() };
  }

  public isCurrentLeader(): boolean {
    return this.isLeader;
  }

  public getServerInfo(): ServerInfo {
    return {
      id: this.serverId,
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT || '3000'),
      region: process.env.REGION || 'default',
      isLeader: this.isLeader,
      lastHeartbeat: this.lastHeartbeat
    };
  }

  public getClusterState(): { servers: ServerInfo[]; currentTerm: number; leaderId: string | null } {
    return {
      servers: this.servers.map(s => ({
        ...s,
        isLeader: s.id === this.serverId ? this.isLeader : false
      })),
      currentTerm: this.currentTerm,
      leaderId: this.isLeader ? this.serverId : null
    };
  }

  public cleanup() {
    if (this.electionTimer) clearInterval(this.electionTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }
}

let leaderElectionInstance: APIServerLeaderElection | null = null;

export function initializeLeaderElection(serverId: string, servers: ServerInfo[]) {
  if (!leaderElectionInstance) {
    leaderElectionInstance = new APIServerLeaderElection(serverId, servers);
  }
  return leaderElectionInstance;
}

export function getLeaderElection(): APIServerLeaderElection | null {
  return leaderElectionInstance;
}

export function isLeader(): boolean {
  return leaderElectionInstance?.isCurrentLeader() || false;
}

export async function handleLeaderElectionAPI(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const message: ElectionMessage = await req.json();
    
    if (!leaderElectionInstance) {
      return NextResponse.json({ error: 'Leader election not initialized' }, { status: 500 });
    }

    const response = leaderElectionInstance.handleElectionMessage(message);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling leader election message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export type { ServerInfo, ElectionMessage };
