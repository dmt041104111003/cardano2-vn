# MDX Documentation Guide - Cardano2vn

## Overview

MDX (Markdown + JSX) is a technology that allows you to write documentation content with the ability to embed React components. In the Cardano2vn project, MDX is used to create interactive and dynamic documentation.

## Quick Start

<details>
<summary><strong>Get Started in 2 Minutes</strong></summary>

### 1. Create MDX File
```bash
touch content/docs/your-topic/your-page.mdx
```

### 2. Basic Structure
```mdx
---
title: "Page Title"
description: "Brief description"
date: "2024-12-25"
author: "Author Name"
---

# Main Title
Content here...
```

</details>

## System Architecture

<details>
<summary><strong>Project Structure</strong></summary>

```
cardano2vn/
├── content/docs/                    # Directory containing all MDX files
│   ├── index.mdx                   # Docs homepage
│   ├── learn-about-cardano/        # Topic: Learn about Cardano
│   │   ├── introduction/
│   │   │   └── introduction.mdx
│   │   ├── learn/
│   │   │   ├── cardano-nodes/
│   │   │   │   └── cardano-nodes.mdx
│   │   │   └── consensus-explained/
│   │   │       └── consensus-explained.mdx
│   │   └── new-to-cardano/
│   │       └── what-is-a-blockchain/
│   │           └── what-is-a-blockchain.mdx
│   ├── education/                   # Topic: Education
│   │   ├── community-education-initiatives.mdx
│   │   ├── input-output-education.mdx
│   │   └── plutus-ioneer-program.mdx
│   ├── explore-developer-resources/ # Topic: Developer Resources
│   │   ├── native-tokens/
│   │   │   └── native-tokens.mdx
│   │   ├── smart-contracts/
│   │   │   ├── aiken/
│   │   │   │   └── aiken.mdx
│   │   │   ├── marlowe/
│   │   │   │   └── marlowe.mdx
│   │   │   └── plutus/
│   │   │       └── plutus.mdx
│   │   └── welcome/
│   │       └── welcome.mdx
│   ├── stake-pool-operations/       # Topic: Stake Pool Operations
│   │   ├── about-stake-pools-operators-and-owners/
│   │   │   └── about-stake-pools-operators-and-owners.mdx
│   │   ├── creating-keys-and-operational-certificates/
│   │   │   └── creating-keys-and-operational-certificates.mdx
│   │   └── ...
│   └── testnets/                   # Topic: Testnets
│       ├── getting-started-with-cardano-testnets/
│       │   └── getting-started-with-cardano-testnets.mdx
│       └── ...
├── src/
│   ├── mdx-components.tsx          # MDX components configuration
│   ├── app/docs/                   # Route handler for docs
│   │   └── [[...slug]]/
│   │       └── page.tsx
│   └── constants/docs.ts           # Navigation configuration
└── next.config.ts                  # Next.js configuration with MDX
```

</details>

## File Organization

<details>
<summary><strong>Directory Structure & Naming</strong></summary>

### Directory Structure
```
content/docs/
├── learn-about-cardano/     # Cardano basics
├── education/               # Educational content
├── explore-developer-resources/ # Developer tools
├── stake-pool-operations/   # Stake pool guides
└── testnets/               # Testnet documentation
```

### Naming Convention
- `cardano-nodes.mdx`
- `cardano_nodes.mdx`

</details>

## Frontmatter - Page Metadata

<details>
<summary><strong>Frontmatter Options Reference</strong></summary>

### Standard Frontmatter structure

```yaml
---
title: "Page Name"
description: "Brief description (used for SEO and preview)"
date: "YYYY-MM-DD"
author: "Author Name"
tags: ["cardano", "blockchain", "tutorial"]
category: "education"
difficulty: "beginner" # beginner, intermediate, advanced
readTime: "5 min"
lastUpdated: "2024-12-25"
---
```

### Frontmatter Options Reference

| Field | Required | Example |
|-------|----------|---------|
| `title` | Yes | "Cardano Wallet Guide" |
| `description` | Yes | "Learn to create Cardano wallet" |
| `date` | Yes | "2024-12-25" |
| `author` | Yes | "Cardano2vn Team" |
| `difficulty` | No | "beginner/intermediate/advanced" |
| `readTime` | No | "10 min" |
| `tags` | No | `["cardano", "wallet"]` |

### Real Frontmatter example

```yaml
---
title: "Introduction to Cardano Blockchain"
description: "Learn the basics of Cardano, a third-generation blockchain with scientific proof"
date: "2024-12-25"
author: "Cardano2vn Team"
tags: ["cardano", "blockchain", "introduction", "basics"]
category: "learn-about-cardano"
difficulty: "beginner"
readTime: "10 min"
lastUpdated: "2024-12-25"
---
```

</details>

## Writing MDX Content

<details>
<summary><strong>Markdown Basics</strong></summary>

### 1. Basic Markdown

```mdx
# Level 1 Heading - Use only for main title
## Level 2 Heading - Use for main sections
### Level 3 Heading - Use for subsections
#### Level 4 Heading - Use for small items

**Bold text** and *italic text*

> Blockquote - important quote

---

[Link text](https://example.com)

![Alt text](https://example.com/image.jpg)
```

### 2. Code blocks with syntax highlighting

```mdx
### JavaScript/TypeScript
```javascript
const cardano = {
  name: "Cardano",
  type: "blockchain",
  consensus: "Ouroboros"
};

console.log(cardano.name);
```

### Bash commands
```bash
# Check Cardano CLI version
cardano-cli --version

# Query blockchain tip
cardano-cli query tip --mainnet
```

### JSON
```json
{
  "poolId": "pool1...",
  "ticker": "CARD",
  "description": "Cardano Stake Pool"
}
```

### YAML
```yaml
# cardano-node config
ShelleyGenesisFile: genesis.json
AlonzoGenesisFile: alonzo-genesis.json
```

### 3. Lists and Tables

```mdx
### Unordered list
- Cardano is a third-generation blockchain
- Uses Ouroboros consensus
- Supports smart contracts with Plutus

### Ordered list
1. Install Cardano CLI
2. Create wallet
3. Stake ADA

### Nested list
- Cardano Features:
  - Smart Contracts
  - Native Tokens
  - Staking
  - Governance

### Table
| Feature | Description | Status |
|---------|-------------|--------|
| Smart Contracts | Plutus & Marlowe | Active |
| Native Tokens | CIP-68 | Active |
| Staking | Delegation | Active |
| Governance | Voltaire | In Progress |
```

</details>

## Using React Components in MDX

<details>
<summary><strong>React Components Guide</strong></summary>

### 1. Available Components

```mdx
### Alert Box
<AlertBox type="info" title="Important Information">
  Cardano uses Proof of Stake instead of Proof of Work.
</AlertBox>

<AlertBox type="warning" title="Warning">
  Always backup your private keys.
</AlertBox>

<AlertBox type="error" title="Error">
  Never share private keys with anyone.
</AlertBox>
```

### 2. Code Demo Component

```mdx
### Interactive Code Demo
<CodeDemo 
  language="javascript"
  title="Cardano Address Generation"
>
```javascript
import { Cardano } from '@meshsdk/core';

const address = Cardano.getAddress();
console.log(address);
```
</CodeDemo>
```

### 3. Custom Components

```mdx
### Cardano Info Card
<CardanoInfoCard
  title="Ouroboros Consensus"
  description="Proof of Stake algorithm"
  icon="shield"
  link="/docs/consensus"
/>

### Feature Comparison
<ComparisonTable
  features={[
    { name: "Cardano", consensus: "PoS", smartContracts: "Yes" },
    { name: "Bitcoin", consensus: "PoW", smartContracts: "Limited" },
    { name: "Ethereum", consensus: "PoS", smartContracts: "Yes" }
  ]}
/>
```

</details>

## Content Organization by Topic

<details>
<summary><strong>Content Structure Guide</strong></summary>

### 1. Standard directory structure

```
content/docs/
├── learn-about-cardano/           # Learn about Cardano
│   ├── introduction/
│   │   └── introduction.mdx       # General introduction
│   ├── learn/
│   │   ├── cardano-nodes/
│   │   │   └── cardano-nodes.mdx # About Cardano nodes
│   │   ├── consensus-explained/
│   │   │   └── consensus-explained.mdx # Consensus explanation
│   │   └── ouroboros-overview/
│   │       └── ouroboros-overview.mdx # Ouroboros overview
│   └── new-to-cardano/
│       ├── what-is-a-blockchain/
│       │   └── what-is-a-blockchain.mdx # What is blockchain
│       └── what-is-a-cryptocurrency/
│           └── what-is-a-cryptocurrency.mdx # What is cryptocurrency
├── education/                     # Education
│   ├── community-education-initiatives.mdx
│   ├── input-output-education.mdx
│   └── plutus-ioneer-program.mdx
├── explore-developer-resources/   # Developer Resources
│   ├── native-tokens/
│   │   └── native-tokens.mdx
│   ├── smart-contracts/
│   │   ├── aiken/
│   │   │   └── aiken.mdx
│   │   ├── marlowe/
│   │   │   └── marlowe.mdx
│   │   └── plutus/
│   │       └── plutus.mdx
│   └── welcome/
│       └── welcome.mdx
├── stake-pool-operations/         # Stake Pool Operations
│   ├── about-stake-pools-operators-and-owners/
│   │   └── about-stake-pools-operators-and-owners.mdx
│   ├── creating-keys-and-operational-certificates/
│   │   └── creating-keys-and-operational-certificates.mdx
│   ├── establishing-connectivity-between-the-nodes/
│   │   └── establishing-connectivity-between-the-nodes.mdx
│   └── ...
└── testnets/                     # Testnets
    ├── getting-started-with-cardano-testnets/
    │   └── getting-started-with-cardano-testnets.mdx
    ├── creating-a-local-testnet/
    │   └── creating-a-local-testnet.mdx
    └── ...
```

### 2. Naming Convention

```bash
# Good file names
cardano-nodes.mdx
consensus-explained.mdx
what-is-a-blockchain.mdx
stake-pool-setup.mdx

# Bad file names
cardano_nodes.mdx
consensus-explained-page.mdx
blockchain-intro.mdx
```

### 3. Standard content structure

```mdx
---
title: "Page Name"
description: "Brief description"
date: "2024-12-25"
author: "Author Name"
---

# Main Title

## Overview
Brief introduction about the topic.

## Main Content

### Section 1: Basic Concepts
Detailed content...

### Section 2: Practical Guide
Step-by-step instructions...

### Section 3: Real Examples
Concrete examples...

## Summary
Key points summary.

## References
- [Link 1](https://example.com)
- [Link 2](https://example.com)
```

</details>

## Internal Links and Navigation

<details>
<summary><strong>🔗 Link Management</strong></summary>

### 1. Internal links

```mdx
### Link to another page
Learn more about [Cardano Nodes](/docs/learn-about-cardano/learn/cardano-nodes/cardano-nodes).

### Link with anchor
See details about [Consensus](/docs/learn-about-cardano/learn/consensus-explained/consensus-explained#ouroboros).

### Relative link
Read more about [Blockchain Basics](/docs/learn-about-cardano/new-to-cardano/what-is-a-blockchain/what-is-a-blockchain).
```

### 2. External Links

```mdx
### External links
- [Cardano Official Documentation](https://docs.cardano.org)
- [IOHK Research Papers](https://iohk.io/en/research/library/)
- [Cardano Foundation](https://cardanofoundation.org)
```

### 3. Link Formats Reference

```mdx
# Link to another page
[Cardano Nodes](/docs/learn-about-cardano/learn/cardano-nodes/cardano-nodes)

# Link with anchor
[Consensus](/docs/learn-about-cardano/learn/consensus-explained#ouroboros)

# External link
[Cardano Docs](https://docs.cardano.org)
```

</details>

## Styling and Formatting

<details>
<summary><strong>Formatting Guide</strong></summary>

### 1. Typography

```mdx
# Level 1 Heading - Use only for main title
## Level 2 Heading - Use for main sections
### Level 3 Heading - Use for subsections
#### Level 4 Heading - Use for small items

**Bold text** - Emphasize important content
*Italic text* - Light emphasis
`inline code` - Short code
~~Strikethrough~~ - Outdated content
```

### 2. Blockquotes

```mdx
> **Important Note:** Always backup your private keys before performing any operations.

> **Best Practice:** Use hardware wallet for storing large amounts of ADA.

> **Warning:** Never share private keys with anyone.
```

### 3. Code Blocks with Line Numbers

```mdx
```javascript:1:10
// Cardano address generation example
import { Cardano } from '@meshsdk/core';

const generateAddress = () => {
  const address = Cardano.getAddress();
  return address;
};

console.log(generateAddress());
```
```

</details>

## Advanced Components

<details>
<summary><strong>Advanced Features</strong></summary>

### 1. Interactive Diagrams

```mdx
### Cardano Architecture
<ArchitectureDiagram
  layers={[
    { name: "Application", components: ["dApps", "Wallets"] },
    { name: "Consensus", components: ["Ouroboros"] },
    { name: "Network", components: ["P2P Network"] },
    { name: "Settlement", components: ["UTXO Model"] }
  ]}
/>
```

### 2. Progress Indicators

```mdx
### Cardano Development Phases
<ProgressTimeline
  phases={[
    { name: "Byron", status: "completed", year: "2017" },
    { name: "Shelley", status: "completed", year: "2020" },
    { name: "Goguen", status: "completed", year: "2021" },
    { name: "Basho", status: "in-progress", year: "2022" },
    { name: "Voltaire", status: "planned", year: "2024" }
  ]}
/>
```

### 3. Comparison Tables

```mdx
### Consensus Comparison
<ComparisonTable
  headers={["Feature", "Cardano", "Bitcoin", "Ethereum"]}
  rows={[
    ["Consensus", "Ouroboros PoS", "Nakamoto PoW", "Casper PoS"],
    ["TPS", "250+", "7", "15-30"],
    ["Energy", "Low", "High", "Medium"],
    ["Smart Contracts", "Plutus/Marlowe", "Limited", "Solidity"]
  ]}
/>
```

</details>

## SEO and Metadata

<details>
<summary><strong>SEO Optimization</strong></summary>

### 1. Frontmatter SEO

```yaml
---
title: "Guide to Creating Cardano Stake Pool"
description: "Detailed guide on how to create and operate a Cardano stake pool from A-Z"
keywords: ["cardano", "stake pool", "staking", "ada", "blockchain"]
author: "Cardano2vn Team"
date: "2024-12-25"
lastUpdated: "2024-12-25"
readTime: "15 min"
difficulty: "advanced"
category: "stake-pool-operations"
tags: ["stake-pool", "cardano", "tutorial", "advanced"]
ogImage: "/images/stake-pool-guide.jpg"
---
```

### 2. Structured Data

```mdx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Create Cardano Stake Pool",
  "description": "Guide to create stake pool",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Install Cardano Node",
      "text": "Install Cardano node on server"
    }
  ]
}
</script>
```

</details>

## Best Practices

<details>
<summary><strong>Quality Guidelines</strong></summary>

### 1. Content Organization

- [ ] Use clear heading hierarchy
- [ ] Create logically structured content
- [ ] Use lists for enumerated information
- [ ] Add real code examples
- [ ] Include screenshots and diagrams

### 2. Writing Style

- [ ] Write clearly and understandably
- [ ] Use active voice
- [ ] Avoid unnecessary jargon
- [ ] Add context for technical terms
- [ ] Include practical examples

### 3. Code Examples

- [ ] Use syntax highlighting
- [ ] Add explanatory comments
- [ ] Include error handling
- [ ] Provide complete working examples
- [ ] Test code before publishing

### 4. Images and Media

```mdx
### Screenshots
![Cardano Node Setup](/images/cardano-node-setup.png)

### Diagrams
![Cardano Architecture](/images/cardano-architecture.svg)

### Videos
<VideoPlayer
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Cardano Tutorial"
/>
```

</details>

## Troubleshooting

<details>
<summary><strong>Common Issues & Solutions</strong></summary>

### 1. Common Issues

**Issue: Component not rendering**
```bash
# Check import in mdx-components.tsx
import { YourComponent } from './path/to/component';

# Check export
export default YourComponent;
```

**Issue: Syntax highlighting not working**
```bash
# Install highlight.js
npm install highlight.js

# Import in mdx-components.tsx
import 'highlight.js/styles/github.css';
```

**Issue: Internal links not working**
```mdx
# Correct format
[Link text](/docs/path/to/page)

# Wrong format
[Link text](docs/path/to/page)
```

### 2. Debug Techniques

```typescript
// Add console.log for debugging
console.log('MDX Content:', page.data.body);
console.log('Page Data:', page.data);
console.log('Navigation:', docCategories);
```

</details>

## Real Examples

<details>
<summary><strong>Complete Examples</strong></summary>

### 1. Tutorial Page

```mdx
---
title: "Guide to Creating Cardano Wallet"
description: "Detailed guide on how to create and use Cardano wallet"
date: "2024-12-25"
author: "Cardano2vn Team"
difficulty: "beginner"
readTime: "10 min"
---

# Guide to Creating Cardano Wallet

## Overview

Cardano wallet is an essential tool for interacting with the Cardano blockchain. This guide will help you create a secure wallet.

## Step 1: Choose Wallet

There are different types of wallets:

- **Daedalus**: Full node wallet (most secure)
- **Yoroi**: Light wallet (convenient)
- **Eternl**: Mobile wallet (portable)

## Step 2: Create Wallet

### Using Daedalus

```bash
# Download Daedalus
wget https://daedaluswallet.io/download

# Install
sudo dpkg -i daedalus-*.deb
```

### Using Yoroi

```javascript
// Create wallet programmatically
import { YoroiWallet } from '@yoroi/wallet';

const wallet = await YoroiWallet.create({
  name: 'My Cardano Wallet',
  password: 'secure-password'
});
```

## Step 3: Backup and Security

> **Important:** Always backup recovery phrase and store securely.

### Backup Recovery Phrase

1. Write down the 24-word recovery phrase
2. Store offline (not on computer)
3. Test restore wallet before using

## Step 4: Receive ADA

```bash
# Generate address to receive ADA
cardano-cli address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey

cardano-cli address build \
  --payment-verification-key-file payment.vkey \
  --out-file payment.addr
```

## Summary

- Choose wallet suitable for your needs
- Create wallet with strong password
- Backup recovery phrase securely
- Test restore before using

## References

- [Cardano Documentation](https://docs.cardano.org)
- [Daedalus Wallet](https://daedaluswallet.io)
- [Yoroi Wallet](https://yoroi-wallet.com)
```

### 2. Technical Reference Page

```mdx
---
title: "Cardano CLI Commands Reference"
description: "Complete reference for Cardano CLI commands"
date: "2024-12-25"
author: "Cardano2vn Team"
difficulty: "intermediate"
readTime: "20 min"
---

# Cardano CLI Commands Reference

## Overview

Cardano CLI is a command-line tool for interacting with the Cardano blockchain. This document provides a complete reference for important commands.

## Query Commands

### Check node status

```bash
# Query tip
cardano-cli query tip --mainnet

# Query protocol parameters
cardano-cli query protocol-parameters --mainnet --out-file protocol.json

# Query stake distribution
cardano-cli query stake-distribution --mainnet
```

### Check wallet

```bash
# Query UTXO
cardano-cli query utxo \
  --address $(cat payment.addr) \
  --mainnet

# Query stake address
cardano-cli query stake-address-info \
  --address stake1... \
  --mainnet
```

## Transaction Commands

### Create transaction

```bash
# Build transaction
cardano-cli transaction build \
  --tx-in $TXIN \
  --tx-out $(cat payment.addr)+1000000 \
  --change-address $(cat payment.addr) \
  --mainnet \
  --out-file tx.raw

# Sign transaction
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --mainnet \
  --out-file tx.signed

# Submit transaction
cardano-cli transaction submit \
  --tx-file tx.signed \
  --mainnet
```

## Stake Pool Commands

### Create stake pool

```bash
# Generate keys
cardano-cli node key-gen \
  --cold-verification-key-file cold.vkey \
  --cold-signing-key-file cold.skey \
  --operational-certificate-issue-counter opcert.counter

# Register stake pool
cardano-cli stake-pool registration-certificate \
  --cold-verification-key-file cold.vkey \
  --vrf-verification-key-file vrf.vkey \
  --pool-pledge 1000000000 \
  --pool-cost 340000000 \
  --pool-margin 0.05 \
  --reward-account-verification-key-file stake.vkey \
  --pool-owner-stake-verification-key-file stake.vkey \
  --out-file pool-registration.cert
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Network.Socket.connect` | Node not connected | Check if node is running |
| `UTxO (UTxOError)` | Insufficient UTXO | Check balance |
| `ValidationError` | Invalid transaction | Check parameters |

### Debug Commands

```bash
# Check node logs
journalctl -u cardano-node -f

# Check network connectivity
ping 8.8.8.8

# Check disk space
df -h
```

## Best Practices

### Performance

- Use `--mainnet` flag for production
- Use `--testnet-magic 1097911063` for testnet
- Backup keys regularly
- Monitor node performance

### Security

- Never share private keys
- Use hardware wallet for large amounts
- Test on testnet before mainnet
- Keep software updated

## References

- [Cardano CLI Documentation](https://docs.cardano.org/cardano-node/reference/)
- [Cardano Developer Portal](https://developers.cardano.org)
- [IOHK Technical Documentation](https://iohk.io/en/research/library/)
```

</details>

## Quick Reference

<details>
<summary><strong>Quick Reference</strong></summary>

### File Extensions
- `.mdx` - MDX files with React components
- `.md` - Standard Markdown files

### Common Directories
- `content/docs/` - All documentation files
- `src/mdx-components.tsx` - Component configuration
- `src/constants/docs.ts` - Navigation configuration

### Development Commands
```bash
# Start development server
npm run dev

# Build project
npm run build

# Check for errors
npm run lint
```

</details>

## MDX Writer Checklist

<details>
<summary><strong>Writer Checklist</strong></summary>

### Before writing
- [ ] Define topic and objectives
- [ ] Research related content
- [ ] Prepare code examples
- [ ] Create detailed outline

### While writing
- [ ] Use complete frontmatter
- [ ] Create clear heading hierarchy
- [ ] Add real code examples
- [ ] Include screenshots/diagrams
- [ ] Write structured content

### After writing
- [ ] Review and edit content
- [ ] Test code examples
- [ ] Check internal links
- [ ] Verify external links
- [ ] Test on development server

</details>

## Support

<details>
<summary><strong>Help & Resources</strong></summary>

### Debug Commands
```typescript
console.log('MDX Content:', page.data.body);
console.log('Page Data:', page.data);
```

### Resources
- [MDX Documentation](https://mdxjs.com/)
- [Fumadocs Documentation](https://fumadocs.vercel.app/)
- [Next.js MDX](https://nextjs.org/docs/advanced-features/using-mdx)

</details>

---

**Note:** Follow the structure and conventions of the Fumadocs framework to ensure consistency and avoid errors. 