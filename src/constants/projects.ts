import { Learn, Check, Verify, Onboarding, Decentralized } from "~/components/icons";
import { images } from "~/public/images";
import { Project } from "~/types";

export const projects: Project[] = [
  {
    id: 1,
    title: "Open source dynamic assets (Token/NFT) generator (CIP68)",
    name: "The CIP68 Smart Contracts",
    description: "A smart contract that allows users to create and manage dynamic assets on Cardano.",
    image: images.cip68,

    href: "https://cip68.cardano2vn.io",
    skills: [
      {
        id: 1,
        title: "Asset Minting",
        description: "Create and manage dynamic assets on Cardano.",
        color: "blue",
        Icon: Learn,
      },
      {
        id: 2,
        title: "Asset Updating",
        description: "Create and manage dynamic assets on Cardano.",
        color: "green",
        Icon: Check,
      },

      {
        id: 3,
        title: "Asset Burning",
        description: "Create and manage dynamic assets on Cardano.",
        color: "purple",
        Icon: Verify,
      },
    ],

    results: [
      {
        id: 1,
        title: "Dynamic Asset Creation",
        description: "Users can create dynamic assets with custom metadata.",
        color: "green",
        Icon: Verify,
      },
      {
        id: 2,
        title: "Asset Management",
        description: "Manage and update dynamic assets efficiently.",
        color: "blue",
        Icon: Onboarding,
      },

      {
        id: 2,
        title: "Asset Management",
        description: "Manage and update dynamic assets efficiently.",
        color: "purple",
        Icon: Decentralized,
      },
    ],
  },

  {
    id: 1,
    title: "Dualtarget for ADA-Holders (Staking and increasing assets) with a decentralized automated trading bot",
    name: "The Dualtarget Smart Contracts",
    description: "A smart contract that allows users to create and manage dynamic assets on Cardano.",
    image: images.dualtarget,

    href: "https://dualtarget.xyz",
    skills: [
      {
        id: 1,
        title: "Asset Minting",
        description: "Create and manage dynamic assets on Cardano.",
        color: "blue",
        Icon: Learn,
      },
      {
        id: 2,
        title: "Asset Updating",
        description: "Create and manage dynamic assets on Cardano.",
        color: "green",
        Icon: Check,
      },

      {
        id: 3,
        title: "Asset Burning",
        description: "Create and manage dynamic assets on Cardano.",
        color: "purple",
        Icon: Verify,
      },
    ],

    results: [
      {
        id: 1,
        title: "Dynamic Asset Creation",
        description: "Users can create dynamic assets with custom metadata.",
        color: "green",
        Icon: Verify,
      },
      {
        id: 2,
        title: "Asset Management",
        description: "Manage and update dynamic assets efficiently.",
        color: "blue",
        Icon: Onboarding,
      },

      {
        id: 2,
        title: "Asset Management",
        description: "Manage and update dynamic assets efficiently.",
        color: "purple",
        Icon: Decentralized,
      },
    ],
  },
];
