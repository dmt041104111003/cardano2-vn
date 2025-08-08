const http = require('http');

const healthServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    const health = {
      status: 'healthy',
      service: 'websocket-server',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const port = process.env.PORT;

healthServer.listen(port, () => {
  console.log(`Health check server started on port ${port}`);
  console.log(`Health endpoint: http://localhost:${port}/health`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down health server...');
  healthServer.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down health server...');
  healthServer.close(() => {
    process.exit(0);
  });
});
