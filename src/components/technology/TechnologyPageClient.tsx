"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Project from "~/components/project";
import Skill from "~/components/skill";
import Title from "~/components/title";
import {Learn,Check, Verify, Decentralized, Onboarding } from "~/components/icons";

interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
}

export default function TechnologyPageClient() {
  const {
    data: queryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      const response = await fetch('/api/technologies');
      if (!response.ok) {
        throw new Error('Failed to fetch technologies');
      }
      return response.json();
    }
  });

  const technologies: Technology[] = queryData?.technologies || [];

  const defaultResults = [
    {
      Icon: () => <Verify color="blue" />,
      title: "Dynamic Asset Creation",
      description: "Users can create dynamic assets with custom metadata.",
      color: "green"
    },
    {
      Icon: () => <Onboarding color="blue" />,
      title: "Asset Management",
      description: "Manage and update dynamic assets efficiently.",
      color: "blue"
    },
    {
      Icon: () => <Decentralized color="blue" />,
      title: "Asset Management",
      description: "Manage and update dynamic assets efficiently.",
      color: "purple"
    }
  ];

  const featureCards = [
    {
      Icon: () => <Learn color="blue" />,
      title: "Asset Minting",
      description: "Create and manage dynamic assets on Cardano.",
      color: "blue"
    },
    {
      Icon: () => <Check color="green" />,
      title: "Asset Updating", 
      description: "Create and manage dynamic assets on Cardano.",
      color: "green"
    },
    {
      Icon: () => <Verify color="purple" />,
      title: "Asset Burning",
      description: "Create and manage dynamic assets on Cardano.",
      color: "purple"
    }
  ];

  if (isLoading) {
    return (
      <main className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title title="Our Technology" description="Discover how Andamio's innovative tools are shaping the future of decentralized work." />
          <div className="pb-20">
            <section className="mb-16 text-left">
              <aside className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
                <div className="flex w-full gap-7 max-sm:flex-col">
                  <div className='m relative aspect-video w-[60%] rounded-3xl before:absolute before:left-8 before:top-8 before:h-full before:w-full before:rounded-3xl before:bg-slate-900 before:shadow-xl before:content-[""] max-sm:w-full'>
                    <iframe
                      className="absolute inset-0 z-10 block h-full w-full rounded-xl"
                      src="https://www.youtube.com/embed/_GrbIRoT3mU"
                      title="Open source dynamic assets (Token/NFT) generator (CIP68)"
                      frameBorder={"none"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                  <div className="z-10 flex w-[40%] flex-col items-start gap-[15px] max-md:gap-3 max-sm:w-full">
                    <h2 className="text-left text-[25px]  font-bold max-md:text-xl">About Cardano2vn</h2>
                    <p className="mb-1 text-[20px] font-normal max-md:text-lg">Open source dynamic assets (Token/NFT) generator (CIP68)</p>
                    <span className={"text-left leading-[1.8] max-md:text-base"}>
                      Open source dynamic assets (Token/NFT) generator (CIP68) CIP68 Generator is a tool designed to simplify the creation, management,
                      and burning of CIP68-compliant native assets on the Cardano platform. It provides an easy-to-use interface for non-technical users
                      to interact with these assets while also offering open-source code for developers to integrate and deploy applications faster and
                      more efficiently.
                    </span>
                    <Link href="https://cips.cardano.org/cip/CIP-68" target="_blank">
                      <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                        Learn More Cardano2vn
                      </button>
                    </Link>
                  </div>
                </div>
              </aside>
            </section>
            
            <div className="space-y-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-4 w-1/3"></div>
                  <div className="h-64 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
            
            <section className="mt-16 rounded-sm border border-white/20 bg-gray-800/50 p-8 text-center backdrop-blur-sm">
              <h2 className="mb-4 text-3xl font-bold text-white">Start Your Cardano2vn Journey Today</h2>
              <Link href="https://lms.andamio.io">
                <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                  Open Cardano2vn App
                </button>
              </Link>
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title title="Our Technology" description="Discover how Andamio's innovative tools are shaping the future of decentralized work." />
          <div className="pb-20">
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600">Error loading technologies: {error instanceof Error ? error.message : 'Failed to fetch technologies'}</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative pt-20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title title="Our Technology" description="Discover how Andamio's innovative tools are shaping the future of decentralized work." />
        <div className="pb-20">
          <section className="mb-16 text-left">
            <aside className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
              <div className="flex w-full gap-7 max-sm:flex-col">
                <div className='m relative aspect-video w-[60%] rounded-3xl before:absolute before:left-8 before:top-8 before:h-full before:w-full before:rounded-3xl before:bg-slate-900 before:shadow-xl before:content-[""] max-sm:w-full'>
                  <iframe
                    className="absolute inset-0 z-10 block h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/_GrbIRoT3mU"
                    title="Open source dynamic assets (Token/NFT) generator (CIP68)"
                    frameBorder={"none"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                </div>
                <div className="z-10 flex w-[40%] flex-col items-start gap-[15px] max-md:gap-3 max-sm:w-full">
                  <h2 className="text-left text-[25px]  font-bold max-md:text-xl">About Cardano2vn</h2>
                  <p className="mb-1 text-[20px] font-normal max-md:text-lg">Open source dynamic assets (Token/NFT) generator (CIP68)</p>
                  <span className={"text-left leading-[1.8] max-md:text-base"}>
                    Open source dynamic assets (Token/NFT) generator (CIP68) CIP68 Generator is a tool designed to simplify the creation, management,
                    and burning of CIP68-compliant native assets on the Cardano platform. It provides an easy-to-use interface for non-technical users
                    to interact with these assets while also offering open-source code for developers to integrate and deploy applications faster and
                    more efficiently.
                  </span>
                  <Link href="https://cips.cardano.org/cip/CIP-68" target="_blank">
                    <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                      Learn More Cardano2vn
                    </button>
                  </Link>
                </div>
              </div>
            </aside>
          </section>
          
          {technologies.map((technology, index) => (
            <div key={technology.id}>
              <Skill title={technology.title} skills={[]} />
              
              <section className="mb-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {featureCards.map((card, cardIndex) => (
                    <div key={cardIndex} className="rounded-lg border border-white/20 bg-gray-800/50 p-6">
                      <div className="mb-4">
                        <card.Icon />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                      <p className="text-gray-300">{card.description}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <Project 
                title={technology.name} 
                description={technology.description} 
                href={technology.href} 
                image={technology.image} 
                results={defaultResults} 
              />
            </div>
          ))}
          
          <section className="mt-16 rounded-sm border border-white/20 bg-gray-800/50 p-8 text-center backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-white">Start Your Cardano2vn Journey Today</h2>
            <Link href="https://lms.andamio.io">
              <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                Open Cardano2vn App
              </button>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
} 