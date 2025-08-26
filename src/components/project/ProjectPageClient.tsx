"use client";
import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProjectCard from "~/components/project-card";
import ProjectModal from "~/components/project-modal";
import ProjectSkeleton from "~/components/project/ProjectSkeleton";
import Pagination from "~/components/pagination";
import Navigation from "~/components/navigation";
import Title from "~/components/title";
import TechnologyPageClient from "~/components/technology/TechnologyPageClient";
import NotFoundInline from "~/components/ui/not-found-inline";
import Loading from "~/components/ui/Loading";
import { useNotifications } from "~/hooks/useNotifications";

function ProjectPageContent() {
  const searchParams = useSearchParams();
  const [year, setYear] = useState<number | null>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fundFilter, setFundFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("catalyst");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 6;
  
  useNotifications();
  
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
  
  const projects = data?.data || [];
  const years = Array.from(new Set(projects.map((p: any) => p.year))).sort((a: unknown, b: unknown) => (a as number) - (b as number)) as number[];
  
  useEffect(() => {
    if (years.length > 0 && year === null) {
      setYear(years[0]);
    }
  }, [years, year]);
  useEffect(() => {
    const urlTypeFilter = searchParams.get('typeFilter');
    if (urlTypeFilter && (urlTypeFilter === 'catalyst' || urlTypeFilter === 'project')) {
      setTypeFilter(urlTypeFilter);
    }
  }, [searchParams]);
  
  const filteredProjects = projects.filter((proposal: any) => {
    const matchesYear = year === null || proposal.year === year;
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesFundFilter = fundFilter === 'all' || proposal.fund === fundFilter;
    return matchesYear && matchesSearch && matchesStatusFilter && matchesFundFilter;
  });
  
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  

  
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

  const handleOpenModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  
  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Background Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none block"
      >
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </motion.div>
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div>
          <Title
            title="Catalyst Cardano2vn Roadmap"
            description="Our journey of building the Andamio platform and ecosystem, from founding to the present day and beyond."
          />
        </div>
        
        <div className="relative">
          <div className="relative z-10">
            <div className="mb-8 mt-2">
              <div dir="ltr" data-orientation="vertical" className="flex flex-col md:flex-row">
                <div>
                  <Navigation 
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    fundFilter={fundFilter}
                    typeFilter={typeFilter}
                    projects={projects}
                    years={years}
                    selectedYear={year || 0}
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
                </div>
                
                <div className="mt-6 flex-1 md:-mt-12">
                  {typeFilter === "catalyst" ? (
                    <div
                      data-state="active"
                      data-orientation="vertical"
                      role="tabpanel"
                      aria-labelledby="radix-:ri:-trigger-2023"
                      id="radix-:ri:-content-2023"
                      className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                    >
                      <motion.div 
                        className="mb-8 text-right"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.6,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <h2 className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
                          {year}
                        </h2>
                      </motion.div>
                      
                      <div className="mb-16 grid grid-cols-1 gap-6">
                        {isLoading ? (
                          <>
                            {[...Array(5)].map((_, idx) => (
                              <div key={idx}>
                                <ProjectSkeleton />
                              </div>
                            ))}
                          </>
                        ) : filteredProjects.length === 0 ? (
                          <div>
                            <NotFoundInline 
                              onClearFilters={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setFundFilter('all');
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            {paginatedProjects.map((proposal: any, index: number) => (
                              <div key={index}>
                                <ProjectCard project={proposal} onOpenModal={handleOpenModal} />
                              </div>
                            ))}

                            {totalPages > 1 && (
                              <div className="mt-8">
                                <Pagination
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  setCurrentPage={setCurrentPage}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.6 }}
                    >
                      <TechnologyPageClient isEmbedded={true} searchTerm={searchTerm} />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}

export default function ProjectPageClient() {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectPageContent />
    </Suspense>
  );
} 