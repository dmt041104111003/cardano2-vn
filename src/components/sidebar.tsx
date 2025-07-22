
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SidebarItem {
  title: string;
  href?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Learn about Cardano",
    children: [
      { title: "Introduction", href: "/learn/introduction" },
      {
        title: "New to Cardano",
        children: [
          { title: "What is a blockchain?", href: "/learn/new/blockchain" },
          { title: "What is a cryptocurrency?", href: "/learn/new/cryptocurrency" },
          { title: "Proof of stake", href: "/learn/new/proof-of-stake" },
          { title: "Cardano tracking tools", href: "/learn/new/tracking-tools" },
          { title: "Types of wallets", href: "/learn/new/wallets" },
          { title: "How to delegate?", href: "/learn/new/delegate" },
          { title: "Staking calculator", href: "/learn/new/staking-calculator" },
          { title: "What is a smart contract?", href: "/learn/new/smart-contract" },
        ],
      },
      {
        title: "Learn",
        children: [
          { title: "Cardano nodes", href: "/learn/detail/nodes" },
          { title: "Stake pools", href: "/learn/detail/stake-pools" },
          { title: "Delegation", href: "/learn/detail/delegation" },
          { title: "Pledging and rewards", href: "/learn/detail/pledging-rewards" },
          { title: "Consensus explained", href: "/learn/detail/consensus" },
          { title: "Ouroboros overview", href: "/learn/detail/ouroboros" },
          { title: "Cardano keys", href: "/learn/detail/keys" },
          { title: "Cardano addresses", href: "/learn/detail/addresses" },
          { title: "Chain vs transaction confirmation", href: "/learn/detail/confirmation" },
          { title: "Extended UTXO model", href: "/learn/detail/eutxo" },
          { title: "Transaction costs and determinism", href: "/learn/detail/transaction-costs" },
          { title: "About the collateral mechanism", href: "/learn/detail/collateral" },
        ],
      },
      {
        title: "Explore more",
        children: [
          { title: "Cardano architecture", href: "/learn/explore/architecture" },
          {
            title: "Cardano network",
            children: [
              { title: "Networking protocol design overview", href: "/learn/explore/network/protocol-design" },
              { title: "Peer-to-peer (P2P) networking", href: "/learn/explore/network/p2p" },
              { title: "Cardano fee structure", href: "/learn/explore/network/fee-structure" },
              { title: "Cardano monetary policy", href: "/learn/explore/network/monetary-policy" },
              { title: "Time handling on Cardano", href: "/learn/explore/network/time-handling" },
              { title: "Understanding concurrency", href: "/learn/explore/network/concurrency" },
              { title: "Cardano protocol parameters reference guide", href: "/learn/explore/network/protocol-parameters" },
              { title: "Relevant research papers and specifications", href: "/learn/explore/network/research-papers" },
            ],
          },
          { title: "Explore developer resources", href: "/learn/explore/developer-resources" },
        ],
      },
      {
        title: "Cardano evolution",
        children: [
          { title: "Design rationale", href: "/learn/evolution/design-rationale" },
          { title: "Development phases and eras", href: "/learn/evolution/phases" },
          { title: "About hard forks", href: "/learn/evolution/hard-forks" },
          {
            title: "Upgrades explained",
            children: [
              { title: "Byron to Shelley", href: "/learn/evolution/upgrades/byron-shelley" },
              { title: "Allegra", href: "/learn/evolution/upgrades/allegra" },
              { title: "Mary", href: "/learn/evolution/upgrades/mary" },
              { title: "Alonzo", href: "/learn/evolution/upgrades/alonzo" },
              { title: "Vasil", href: "/learn/evolution/upgrades/vasil" },
              { title: "Valentine (SECP)", href: "/learn/evolution/upgrades/valentine" },
              { title: "Chang", href: "/learn/evolution/upgrades/chang" },
            ],
          },
        ],
      },
      { title: "Governance overview", href: "/learn/governance" },
      { title: "Contribution guidelines", href: "/learn/contribution" },
    ],
  },
  {
    title: "Explore developer resources",
    children: [
      { title: "Welcome", href: "/developer/welcome" },
      { title: "The Cardano node video course", href: "/developer/node-course" },
      {
        title: "Transaction tutorials",
        children: [
          { title: "Minting transactions", href: "/developer/transactions/minting" },
          { title: "Staking transactions", href: "/developer/transactions/staking" },
          { title: "Withdrawing transactions", href: "/developer/transactions/withdrawing" },
          { title: "Redelegation", href: "/developer/transactions/redelegation" },
          { title: "Multiple purposes", href: "/developer/transactions/multipurpose" },
        ],
      },
      { title: "Native tokens", href: "/developer/native-tokens" },
      {
        title: "Smart contracts",
        children: [
          { title: "Plutus", href: "/developer/smart-contracts/plutus" },
          { title: "Marlowe", href: "/developer/smart-contracts/marlowe" },
          { title: "Aiken", href: "/developer/smart-contracts/aiken" },
        ],
      },
      {
        title: "Scalability solutions",
        children: [
          { title: "Hydra", href: "/developer/scalability/hydra" },
          { title: "Mithril", href: "/developer/scalability/mithril" },
        ],
      },
      {
        title: "Release notes",
        children: [
          { title: "Release notes", href: "/developer/release-notes/notes" },
          { title: "Compatibility matrix", href: "/developer/release-notes/compatibility" },
        ],
      },
    ],
  },
  {
    title: "Stake pool operations",
    children: [
      { title: "Operating a stake pool", href: "/stake-pool/operating" },
      { title: "About stake pools, operators, and owners", href: "/stake-pool/about" },
      { title: "Establishing connectivity between the nodes", href: "/stake-pool/connectivity" },
      { title: "Logging and monitoring", href: "/stake-pool/logging" },
      { title: "Creating keys and operational certificates", href: "/stake-pool/keys-certificates" },
      { title: "Stake pool operations and maintenance", href: "/stake-pool/maintenance" },
      { title: "Pool metadata management", href: "/stake-pool/metadata" },
      { title: "Stake pool performance", href: "/stake-pool/performance" },
      { title: "Stake pool ranking", href: "/stake-pool/ranking" },
      { title: "Guidelines for operating large stake pools", href: "/stake-pool/large-pools" },
    ],
  },
  {
    title: "Testnets",
    children: [
      { title: "Testnet environments", href: "/testnets/environments" },
      { title: "Getting started with Cardano testnets", href: "/testnets/getting-started" },
      { title: "Creating a local testnet", href: "/testnets/local" },
      { title: "Resources", href: "/testnets/resources" },
      { title: "Support and feedback", href: "/testnets/support" },
      {
        title: "Tools",
        children: [
          { title: "Testnets faucet", href: "/testnets/tools/faucet" },
          { title: "Daedalus wallet for the Cardano testnets", href: "/testnets/tools/daedalus" },
        ],
      },
    ],
  },
  {
    title: "Education",
    children: [
      { title: "Community education initiatives", href: "/education/community" },
      { title: "Input | Output education", href: "/education/iohk" },
      { title: "Plutus Pioneer program", href: "/education/plutus-pioneer" },
    ],
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const getAllChildTitles = (items: SidebarItem[]): string[] => {
    const titles: string[] = [];
    items.forEach((item) => {
      titles.push(item.title);
      if (item.children) {
        titles.push(...getAllChildTitles(item.children));
      }
    });
    return titles;
  };

  const toggleItem = (title: string) => {
    setExpanded((prev) => {
      if (prev.includes(title)) {
        const childTitles = getAllChildTitles(sidebarItems.find((item) => item.title === title)?.children || []);
        return prev.filter((t) => t !== title && !childTitles.includes(t));
      } else {
        return [...prev, title];
      }
    });
  };

  const renderItems = (items: SidebarItem[], level = 0) => {
    return items.map((item) => {
      const isOpen = expanded.includes(item.title);
      const hasChildren = !!item.children?.length;

      return (
        <div key={item.title} className={level > 0 ? `ml-${level * 4}` : ""}>
          {hasChildren ? (
            <button
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md"
              onClick={() => toggleItem(item.title)}
            >
              <span>{item.title}</span>
              <span>{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
            </button>
          ) : (
            <Link
              href={item.href!}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                selectedChild === item.href ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setSelectedChild(item.href!)}
            >
              <span>{item.title}</span>
            </Link>
          )}
          <AnimatePresence initial={false}>
            {hasChildren && isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="ml-4 mt-1 space-y-1 overflow-hidden"
              >
                {renderItems(item.children!, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`fixed md:mt-20 top-0 left-0 z-40 w-80 h-full bg-gray-900 text-white border-r border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 custom-scrollbar">
          <nav className="space-y-2">{renderItems(sidebarItems)}</nav>
        </div>
      </div>
    </>
  );
}
