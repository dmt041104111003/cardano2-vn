const { WebSocketServer } = require('ws');
const http = require('http');

class LeaderElection {
  constructor(serverId, port, peers) {
    this.serverId = serverId;
    this.port = port;
    this.peers = peers;
    this.state = 'FOLLOWER';
    this.currentTerm = 0;
    this.votedFor = null;
    this.leaderId = null;
    this.electionTimeout = 150 + Math.random() * 150;
    this.lastHeartbeat = Date.now();
    
    this.setupServer();
    this.startElectionTimer();
  }

  setupServer() {
    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({ server: this.httpServer });
    
    this.wss.on('connection', (ws, request) => {
      
      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      });
    });

    this.httpServer.listen(this.port, () => {
    });
  }

  handleMessage(ws, message) {
    switch (message.type) {
      case 'REQUEST_VOTE':
        this.handleRequestVote(ws, message);
        break;
      case 'APPEND_ENTRIES':
        this.handleAppendEntries(ws, message);
        break;
      case 'VOTE_RESPONSE':
        this.handleVoteResponse(ws, message);
        break;
      case 'HEARTBEAT':
        this.handleHeartbeat(ws, message);
        break;
    }
  }

  startElectionTimer() {
    this.electionTimer = setInterval(() => {
      if (this.state !== 'LEADER') {
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat;
        if (timeSinceLastHeartbeat > this.electionTimeout) {
          this.startElection();
        }
      }
    }, 100);
  }

  startElection() {
    this.state = 'CANDIDATE';
    this.currentTerm++;
    this.votedFor = this.serverId;
    this.votesReceived = 1;
    
    
    this.peers.forEach(peer => {
      this.sendRequestVote(peer);
    });
  }

  async sendRequestVote(peer) {
    try {
      const ws = new WebSocket(`ws://${peer.host}:${peer.port}`);
      
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'REQUEST_VOTE',
          term: this.currentTerm,
          candidateId: this.serverId,
          lastLogIndex: 0,
          lastLogTerm: 0
        }));
      });
      
      ws.on('message', (data) => {
        const response = JSON.parse(data.toString());
        if (response.type === 'VOTE_RESPONSE') {
          this.handleVoteResponse(null, response);
        }
      });
    } catch (error) {
    }
  }

  handleRequestVote(ws, message) {
    if (message.term > this.currentTerm) {
      this.currentTerm = message.term;
      this.state = 'FOLLOWER';
      this.votedFor = null;
    }

    const canVote = (this.votedFor === null || this.votedFor === message.candidateId) &&
                   message.term >= this.currentTerm;

    if (canVote) {
      this.votedFor = message.candidateId;
      this.currentTerm = message.term;
      this.resetElectionTimer();
      
      ws.send(JSON.stringify({
        type: 'VOTE_RESPONSE',
        term: this.currentTerm,
        voteGranted: true
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'VOTE_RESPONSE',
        term: this.currentTerm,
        voteGranted: false
      }));
    }
  }

  handleVoteResponse(ws, message) {
    if (message.term === this.currentTerm && this.state === 'CANDIDATE') {
      if (message.voteGranted) {
        this.votesReceived++;
        
        const majority = Math.floor(this.peers.length / 2) + 1;
        if (this.votesReceived >= majority) {
          this.becomeLeader();
        }
      }
    }
  }

  becomeLeader() {
    this.state = 'LEADER';
    this.leaderId = this.serverId;
    this.resetElectionTimer();
    
    
    this.startHeartbeat();
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.peers.forEach(peer => {
        this.sendHeartbeat(peer);
      });
    }, 50);
  }

  sendHeartbeat(peer) {
    try {
      const ws = new WebSocket(`ws://${peer.host}:${peer.port}`);
      
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'APPEND_ENTRIES',
          term: this.currentTerm,
          leaderId: this.serverId,
          prevLogIndex: 0,
          prevLogTerm: 0,
          entries: [],
          leaderCommit: 0
        }));
      });
    } catch (error) {
    }
  }

  handleAppendEntries(ws, message) {
    if (message.term >= this.currentTerm) {
      this.currentTerm = message.term;
      this.state = 'FOLLOWER';
      this.leaderId = message.leaderId;
      this.resetElectionTimer();
      
      ws.send(JSON.stringify({
        type: 'APPEND_ENTRIES_RESPONSE',
        term: this.currentTerm,
        success: true
      }));
    }
  }

  handleHeartbeat(ws, message) {
    this.lastHeartbeat = Date.now();
    this.leaderId = message.leaderId;
    this.currentTerm = message.term;
  }

  resetElectionTimer() {
    this.lastHeartbeat = Date.now();
  }

  getState() {
    return {
      serverId: this.serverId,
      state: this.state,
      term: this.currentTerm,
      leaderId: this.leaderId,
      votedFor: this.votedFor
    };
  }
}

if (require.main === module) {
  const serverId = process.argv[2] || 1;
  const port = process.argv[3] || 10000;
  
  let peers;
  
  if (process.env.NODE_ENV === 'development') {
    peers = [
      { id: 1, host: 'localhost', port: 4001 },
      { id: 2, host: 'localhost', port: 4002 },
      { id: 3, host: 'localhost', port: 4003 }
    ];
  } else {
    const host = process.env.HOST || 'localhost';
    const port = process.env.WEBSOCKET_PORT || 10000;
    
    peers = [
      { id: 1, host, port },
      { id: 2, host, port },
      { id: 3, host, port }
    ];
  }
  
  const otherPeers = peers.filter(peer => peer.id !== parseInt(serverId));

  const leaderElection = new LeaderElection(serverId, port, otherPeers);
  
  setInterval(() => {
    console.log(`[Server ${serverId}] State:`, leaderElection.getState());
  }, 5000);
}

module.exports = LeaderElection;
