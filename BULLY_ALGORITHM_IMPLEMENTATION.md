# Bully Algorithm - Cardano2vn

---
## Documentation Navigation

<div align="center">
  <a href="#overview" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Overview-Main_README-blue?style=for-the-badge" alt="Overview" />
  </a>
  <a href="MDX_DOCS_GUIDE.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/MDX_Guide-Documentation-green?style=for-the-badge" alt="MDX Guide" />
  </a>
  <a href="scripts/WEBSOCKET_README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/WebSocket-Real--time_System-orange?style=for-the-badge" alt="WebSocket Guide" />
  </a>
  <a href="BULLY_ALGORITHM_IMPLEMENTATION.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Bully_Algorithm-Distributed_System-red?style=for-the-badge" alt="Bully Algorithm" />
  </a>
</div>

---

## Core Concept
- **Purpose**: Elect coordinator in distributed systems
- **Principle**: Highest ID node becomes leader
- **Trigger**: Leader failure detection via timeout

---
```
FOLLOWER → CANDIDATE → LEADER
    ↑         ↓         ↓
    └─── Election Timeout ───┘
```


