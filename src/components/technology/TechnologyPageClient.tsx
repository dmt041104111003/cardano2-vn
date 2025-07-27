"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Title from "~/components/title";
import AboutSection from "./AboutSection";
import TechnologyItem from "./TechnologyItem";

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

  if (isLoading) {
    return (
      <main className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title title="Our Technology" description="Discover how Andamio's innovative tools are shaping the future of decentralized work." />
          <div className="pb-20">
            <AboutSection />
            
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
          <AboutSection />
          
          {technologies.map((technology) => (
            <TechnologyItem key={technology.id} technology={technology} />
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