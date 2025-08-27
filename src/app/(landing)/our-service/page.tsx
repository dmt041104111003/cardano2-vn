import { Metadata } from "next";
import StatsPageClient from "~/components/stats/StatsPageClient";

export const metadata: Metadata = {
  title: "Our Service | Cardano2VN",
  description: "Discover our SPO (Stake Pool Operator) and DREP (Delegated Representative) services. Learn how to support our Cardano community initiatives.",
  keywords: ["SPO", "Stake Pool Operator", "DREP", "Delegated Representative", "Cardano", "Staking", "Governance", "Vietnamese Community"],
  openGraph: {
    title: "Our Service | Cardano2VN",
    description: "Discover our SPO (Stake Pool Operator) and DREP (Delegated Representative) services. Learn how to support our Cardano community initiatives.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Service | Cardano2VN",
    description: "Discover our SPO (Stake Pool Operator) and DREP (Delegated Representative) services. Learn how to support our Cardano community initiatives.",
  },
};

export default function OurServicePage() {
  return <StatsPageClient />;
}
