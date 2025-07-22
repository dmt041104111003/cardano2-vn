export interface DocSection {
  id: string;
  title: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

export interface DocCategory {
  id: string;
  title: string;
  sections: DocSection[];
  expandable?: boolean;
}

export const docCategories: DocCategory[] = [
  {
    id: "new-to-cardano",
    title: "New to Cardano?",
    expandable: true,
    sections: [
      { id: "introduction", title: "Introduction", href: "/docs/introduction" },
      { id: "getting-started", title: "Getting Started", href: "/docs/getting-started" },
      { id: "basics", title: "Cardano Basics", href: "/docs/basics" },
    ],
  },
  {
    id: "learn",
    title: "Learn",
    expandable: true,
    sections: [
      { id: "stake-pool-operators", title: "Stake Pool Operators", href: "/docs/stake-pool-operators" },
      { id: "node-operation", title: "Node Operation", href: "/docs/node-operation" },
      { id: "smart-contracts", title: "Smart Contracts", href: "/docs/smart-contracts" },
      { id: "dapps", title: "Building dApps", href: "/docs/dapps" },
    ],
  },
  {
    id: "explore-more",
    title: "Explore more",
    expandable: true,
    sections: [
      { id: "ecosystem", title: "Ecosystem", href: "/docs/ecosystem" },
      { id: "tools", title: "Developer Tools", href: "/docs/tools" },
      { id: "resources", title: "Resources", href: "/docs/resources" },
    ],
  },
  {
    id: "cardano-evolution",
    title: "Cardano evolution",
    expandable: true,
    sections: [
      { id: "roadmap", title: "Roadmap", href: "/docs/roadmap" },
      { id: "updates", title: "Updates", href: "/docs/updates" },
      { id: "governance", title: "Governance", href: "/docs/governance" },
    ],
  },
  {
    id: "direct-links",
    title: "",
    sections: [
      { id: "governance-overview", title: "Governance overview", href: "/docs/governance-overview" },
      { id: "contribution-guidelines", title: "Contribution guidelines", href: "/docs/contribution-guidelines" },
    ],
  },
  {
    id: "external-links",
    title: "",
    sections: [
      { id: "glossary", title: "Glossary", href: "https://docs.cardano.org/glossary", external: true },
      { id: "faqs", title: "FAQs", href: "https://docs.cardano.org/faqs", external: true },
    ],
  },
];

export interface CodeBlock {
  language: string;
  code: string;
  title?: string;
}

export interface AlertBox {
  type: "info" | "warning" | "note";
  title: string;
  content: string;
}

export interface DocSubSection {
  title: string;
  content: string;
  codeBlocks?: CodeBlock[];
  lists?: string[];
  gridItems?: { title: string; description: string }[];
  additionalContent?: string;
}

export interface DocSectionContent {
  title: string;
  content: string;
  description?: string;
  link?: string;
  sections?: DocSubSection[];
  alerts?: AlertBox[];
}

export interface DocContent {
  title: string;
  description: string;
  alerts?: AlertBox[];
  sections: DocSectionContent[];
}

export const monitoringContent: DocContent = {
  title: "Monitoring",
  description: "Learn how to effectively monitor your Cardano stake pool to ensure optimal performance, security, and reliability. This guide covers essential monitoring tools, metrics, and best practices.",
  alerts: [
    {
      type: "info",
      title: "Important",
      content: "Proper monitoring is crucial for maintaining a healthy stake pool and ensuring consistent block production.",
    },
  ],
  sections: [
    {
      title: "Overview",
      content: "Monitoring your Cardano stake pool involves tracking various metrics and system health indicators to ensure your pool operates efficiently and remains competitive. This includes monitoring node synchronization, block production, system resources, and network connectivity.",
    },
    {
      title: "Key Metrics to Monitor",
      content: "",
      sections: [
        {
          title: "Node Synchronization",
          content: "Ensure your node stays synchronized with the Cardano network:",
          codeBlocks: [
            {
              language: "bash",
              code: "cardano-cli query tip --mainnet",
            },
          ],
          additionalContent: "This command returns the current tip of the blockchain. Compare the slot and block values with a trusted block explorer to verify synchronization.",
        },
        {
          title: "Block Production",
          content: "Monitor your pool's block production performance:",
          lists: [
            "Track assigned slots vs. produced blocks",
            "Monitor block production timing",
            "Check for missed slots and orphaned blocks",
            "Analyze epoch performance statistics",
          ],
        },
        {
          title: "System Resources",
          content: "Keep track of essential system metrics:",
          gridItems: [
            { title: "CPU Usage", description: "Monitor CPU utilization to ensure adequate processing power" },
            { title: "Memory Usage", description: "Track RAM consumption and avoid memory exhaustion" },
            { title: "Disk I/O", description: "Monitor disk read/write operations and available space" },
            { title: "Network Traffic", description: "Track incoming and outgoing network connections" },
          ],
        },
      ],
    },
    {
      title: "Monitoring Tools",
      content: "",
      sections: [
        {
          title: "Prometheus and Grafana",
          content: "Set up comprehensive monitoring with Prometheus and Grafana:",
          codeBlocks: [
            {
              language: "bash",
              code: `# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*

# Configure prometheus.yml
cat > prometheus.yml << EOF
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'cardano-node'
    static_configs:
      - targets: ['localhost:12798']
EOF`,
            },
          ],
        },
        {
          title: "Node Exporter",
          content: "Install Node Exporter to collect system metrics:",
          codeBlocks: [
            {
              language: "bash",
              code: `wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
tar xvfz node_exporter-*.tar.gz
cd node_exporter-*
./node_exporter &`,
            },
          ],
        },
        {
          title: "Custom Scripts",
          content: "Create custom monitoring scripts for specific checks:",
          codeBlocks: [
            {
              language: "bash",
              code: `#!/bin/bash
# sync_check.sh - Check node synchronization
CURRENT_SLOT=$(cardano-cli query tip --mainnet | jq -r .slot)
EXPECTED_SLOT=$(curl -s https://explorer.cardano.org/api/blocks/latest | jq -r .slot)
DIFF=$((EXPECTED_SLOT - CURRENT_SLOT))

if [ $DIFF -gt 100 ]; then
    echo "WARNING: Node is $DIFF slots behind"
    # Send alert notification
else
    echo "Node is synchronized (diff: $DIFF slots)"
fi`,
            },
          ],
        },
      ],
    },
    {
      title: "Alerting and Notifications",
      content: "Set up proactive alerting to respond quickly to issues:",
      sections: [
        {
          title: "Critical Alerts",
          content: "Monitor these critical alerts:",
          lists: [
            "Node synchronization loss",
            "Block production failures",
            "High system resource usage",
            "Network connectivity issues",
            "Disk space warnings",
          ],
        },
      ],
      alerts: [
        {
          type: "warning",
          title: "Warning",
          content: "Configure alerts with appropriate thresholds to avoid false positives while ensuring critical issues are detected promptly.",
        },
      ],
    },
    {
      title: "Best Practices",
      content: "",
      sections: [
        {
          title: "Regular Health Checks",
          content: "Perform daily health checks of your node and pool status",
        },
        {
          title: "Automated Monitoring",
          content: "Use automated tools to continuously monitor critical metrics",
        },
        {
          title: "Log Analysis",
          content: "Regularly review node logs for errors and performance issues",
        },
        {
          title: "Performance Baselines",
          content: "Establish performance baselines to identify anomalies",
        },
      ],
    },
    {
      title: "Troubleshooting Common Issues",
      content: "",
      sections: [
        {
          title: "Node Out of Sync",
          content: "If your node falls behind the network:",
          lists: [
            "Check network connectivity",
            "Verify system resources aren't exhausted",
            "Review node logs for errors",
            "Consider restarting the node service",
          ],
        },
        {
          title: "High Memory Usage",
          content: "To address memory consumption issues:",
          lists: [
            "Monitor for memory leaks",
            "Adjust RTS options if necessary",
            "Consider increasing system RAM",
            "Optimize node configuration",
          ],
        },
      ],
    },
  ],
};

export interface DocDocument {
  id: string;
  documentCode: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  lastUpdated: string;
  demoImage: string;
  author: string;
  views: number;
  likes: number;
}

export const docDocuments: DocDocument[] = [
  {
    id: "1",
    documentCode: "DOC-001",
    name: "Getting Started with Cardano",
    description: "Learn the fundamentals of Cardano blockchain, its architecture, and how to get started with development.",
    category: "Getting Started",
    difficulty: "beginner",
    readTime: "15 min",
    lastUpdated: "2025-01-15",
    demoImage: "/images/docs/getting-started.jpg",
    author: "Cardano Team",
    views: 1250,
    likes: 89,
  },
  {
    id: "2",
    documentCode: "DOC-002",
    name: "Plutus Smart Contracts",
    description: "Deep dive into Plutus smart contract development with practical examples and best practices.",
    category: "Smart Contracts",
    difficulty: "intermediate",
    readTime: "45 min",
    lastUpdated: "2025-01-10",
    demoImage: "/images/docs/plutus.jpg",
    author: "IOHK",
    views: 890,
    likes: 156,
  },
  {
    id: "3",
    documentCode: "DOC-003",
    name: "Marlowe for Financial Contracts",
    description: "Build financial smart contracts using Marlowe, Cardano's domain-specific language for DeFi.",
    category: "DeFi",
    difficulty: "intermediate",
    readTime: "30 min",
    lastUpdated: "2025-01-08",
    demoImage: "/images/docs/marlowe.jpg",
    author: "Marlowe Team",
    views: 567,
    likes: 78,
  },
  {
    id: "4",
    documentCode: "DOC-004",
    name: "Native Token Creation",
    description: "Step-by-step guide to creating and managing native tokens on Cardano blockchain.",
    category: "Tokens",
    difficulty: "beginner",
    readTime: "20 min",
    lastUpdated: "2025-01-05",
    demoImage: "/images/docs/tokens.jpg",
    author: "Cardano Foundation",
    views: 1200,
    likes: 92,
  },
  {
    id: "5",
    documentCode: "DOC-005",
    name: "Stake Pool Operation",
    description: "Complete guide to running a stake pool, including setup, maintenance, and optimization.",
    category: "Staking",
    difficulty: "advanced",
    readTime: "60 min",
    lastUpdated: "2025-01-03",
    demoImage: "/images/docs/stake-pool.jpg",
    author: "Stake Pool Alliance",
    views: 445,
    likes: 67,
  },
  {
    id: "6",
    documentCode: "DOC-006",
    name: "Hydra Scaling Solution",
    description: "Understanding Cardano's Hydra layer-2 scaling solution and its implementation.",
    category: "Scaling",
    difficulty: "advanced",
    readTime: "40 min",
    lastUpdated: "2025-01-01",
    demoImage: "/images/docs/hydra.jpg",
    author: "IOHK Research",
    views: 334,
    likes: 45,
  },
  {
    id: "7",
    documentCode: "DOC-007",
    name: "DApp Development Guide",
    description: "Build decentralized applications on Cardano with comprehensive development tutorials.",
    category: "Development",
    difficulty: "intermediate",
    readTime: "50 min",
    lastUpdated: "2024-12-28",
    demoImage: "/images/docs/dapp.jpg",
    author: "Developer Community",
    views: 678,
    likes: 123,
  },
  {
    id: "8",
    documentCode: "DOC-008",
    name: "Cardano Governance",
    description: "Understanding Cardano's governance model, voting mechanisms, and participation.",
    category: "Governance",
    difficulty: "intermediate",
    readTime: "25 min",
    lastUpdated: "2024-12-25",
    demoImage: "/images/docs/governance.jpg",
    author: "Cardano Foundation",
    views: 456,
    likes: 89,
  },
];

export const docListCategories = [
  { id: "all", title: "All Documents", count: docDocuments.length },
  { id: "getting-started", title: "Getting Started", count: 1 },
  { id: "smart-contracts", title: "Smart Contracts", count: 1 },
  { id: "defi", title: "DeFi", count: 1 },
  { id: "tokens", title: "Tokens", count: 1 },
  { id: "staking", title: "Staking", count: 1 },
  { id: "scaling", title: "Scaling", count: 1 },
  { id: "development", title: "Development", count: 1 },
  { id: "governance", title: "Governance", count: 1 },
];

export const introductionContent: DocContent = {
  title: "Welcome to Cardano Documentation",
  description: "Learn about Cardano and build with confidence. Our comprehensive documentation covers everything from basic concepts to advanced development techniques.",
  sections: [
    {
      title: "Getting Started",
      description: "New to Cardano? Start here with the basics.",
      link: "/docs/getting-started",
      content: ""
    },
    {
      title: "Smart Contracts",
      description: "Learn to build smart contracts with Plutus.",
      link: "/docs/smart-contracts",
      content: ""
    },
    {
      title: "DeFi Development",
      description: "Create financial applications with Marlowe.",
      link: "/docs/defi",
      content: ""
    }
  ]
};

export const installationContent: DocContent = {
  title: "Installation",
  description: "Learn how to install and set up the Cardano node and CLI tools on your system.",
  sections: [
    {
      title: "System Requirements",
      content: "Before installing Cardano, ensure your system meets the following requirements:",
      sections: [
        {
          title: "Hardware Requirements",
          content: "Your system should meet these hardware requirements:",
          lists: [
            "CPU: 4+ cores recommended",
            "RAM: 16GB minimum, 32GB recommended",
            "Storage: 100GB+ SSD",
            "Network: Stable internet connection",
          ],
        },
        {
          title: "Operating System",
          content: "Supported operating systems:",
          lists: [
            "Linux (Ubuntu 20.04+ recommended)",
            "macOS 10.15+",
            "Windows 10+ (with WSL2)",
          ],
        },
      ],
    },
    {
      title: "Installing Cardano Node",
      content: "Follow these steps to install the Cardano node:",
      sections: [
        {
          title: "Installation Steps",
          content: "Use the following commands to install Cardano node:",
          codeBlocks: [
            {
              language: "bash",
              code: `# Download the latest release
wget https://github.com/input-output-hk/cardano-node/releases/latest/download/cardano-node-1.35.5-linux.tar.gz

# Extract the archive
tar -xzf cardano-node-1.35.5-linux.tar.gz

# Move to system path
sudo mv cardano-node /usr/local/bin/
sudo mv cardano-cli /usr/local/bin/

# Verify installation
cardano-node --version
cardano-cli --version`,
            },
          ],
        },
      ],
    },
  ],
}; 