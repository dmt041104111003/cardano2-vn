"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import Title from "~/components/title";
import AboutSection from "./AboutSection";
import TechnologyItem from "./TechnologyItem";
import { Pagination } from "~/components/ui/pagination";

interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
}

interface TechnologyPageClientProps {
  isEmbedded?: boolean;
  searchTerm?: string;
}

export default function TechnologyPageClient({ isEmbedded = false, searchTerm = "" }: TechnologyPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 1;

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

  // Filter technologies based on search term
  const filteredTechnologies = technologies.filter(technology => {
    const matchesSearch = technology.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTechnologies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTechnologies = filteredTechnologies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when search changes
  if (searchTerm && currentPage > 1) {
    setCurrentPage(1);
  }

  // If embedded, render only the content without layout
  if (isEmbedded) {
    return (
      <div className="mb-16 grid grid-cols-1 gap-6">
        {isLoading ? (
          <>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </>
        ) : (
          <>
            {paginatedTechnologies.map((technology) => (
              <TechnologyItem key={technology.id} technology={technology} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredTechnologies.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Full page layout
  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* <Title title="Our Technology" description="Discover how Andamio's innovative tools are shaping the future of decentralized work." /> */}
        <div className="pb-20">
          {/* <AboutSection /> */}
          
          {paginatedTechnologies.map((technology) => (
            <TechnologyItem key={technology.id} technology={technology} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTechnologies.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
          
          <section className="mt-16 rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 text-center backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Start Your Cardano2vn Journey Today</h2>
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