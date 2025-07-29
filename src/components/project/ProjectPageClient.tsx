"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "~/components/project-card";
import ProjectSkeleton from "~/components/project/ProjectSkeleton";
import { Pagination } from "~/components/ui/pagination";
import Navigation from "~/components/navigation";
import Title from "~/components/title";
import TechnologyPageClient from "~/components/technology/TechnologyPageClient";
import NotFoundInline from "~/components/ui/not-found-inline";

export default function ProjectPageClient() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fundFilter, setFundFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("catalyst");
  const ITEMS_PER_PAGE = 6;
  
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    },
  });
  
  const projects = data?.projects || [];
  const years = Array.from(new Set(projects.map((p: any) => p.year))).sort((a: unknown, b: unknown) => (a as number) - (b as number)) as number[];
  
  const filteredProjects = projects.filter((proposal: any) => {
    const matchesYear = proposal.year === year;
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesFundFilter = fundFilter === 'all' || proposal.fund === fundFilter;
    return matchesYear && matchesSearch && matchesStatusFilter && matchesFundFilter;
  });
  
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleFilterChange = () => {
    setCurrentPage(1);
  };
  
  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    setCurrentPage(1);
    setSearchTerm("");
    setStatusFilter("all");
    setFundFilter("all");
    setTypeFilter("catalyst");
  };
  
  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Background Logo */}
      <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="Projects Cardano2vn Roadmap"
          description="Our journey of building the Andamio platform and ecosystem, from founding to the present day and beyond."
        />
        <div className="relative">
          <div className="relative z-10">
            <div className="mb-8 mt-2">
              <div dir="ltr" data-orientation="vertical" className="flex flex-col md:flex-row">
                <Navigation 
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  fundFilter={fundFilter}
                  typeFilter={typeFilter}
                  projects={projects}
                  years={years}
                  selectedYear={year}
                  onSearchChange={(value) => {
                    setSearchTerm(value);
                    handleFilterChange();
                  }}
                  onStatusChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange();
                  }}
                  onFundChange={(value) => {
                    setFundFilter(value);
                    handleFilterChange();
                  }}
                  onTypeChange={(value) => {
                    setTypeFilter(value);
                    handleFilterChange();
                  }}
                  onYearChange={handleYearChange}
                />
                <div className="mt-6 flex-1 md:-mt-12">
                  {typeFilter === "project" ? (
                    <TechnologyPageClient isEmbedded={true} searchTerm={searchTerm} />
                  ) : (
                    <div
                      data-state="active"
                      data-orientation="vertical"
                      role="tabpanel"
                      aria-labelledby="radix-:ri:-trigger-2023"
                      id="radix-:ri:-content-2023"
                      className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                    >
                      <div className="mb-8 text-right">
                        <h2 className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
                          {year}
                        </h2>
                      </div>
                      <div className="mb-16 grid grid-cols-1 gap-6">
                        {isLoading ? (
                          <>
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                          </>
                        ) : filteredProjects.length === 0 ? (
                          <NotFoundInline 
                            onClearFilters={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                              setFundFilter('all');
                            }}
                          />
                        ) : (
                          <>
                            {paginatedProjects.map((proposal: any, index: number) => (
                              <ProjectCard key={index} project={proposal} />
                            ))}

                            {totalPages > 1 && (
                              <div className="mt-8">
                                <Pagination
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  totalItems={filteredProjects.length}
                                  itemsPerPage={ITEMS_PER_PAGE}
                                  onPageChange={handlePageChange}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 