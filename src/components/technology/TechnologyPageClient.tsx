"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import TechnologyItem from "./TechnologyItem";
import Pagination from "~/components/pagination";
import NotFoundInline from "~/components/ui/not-found-inline";
import { TechnologyPageClientProps, Technology } from '~/constants/technologies';

export default function TechnologyPageClient({ isEmbedded = false, searchTerm = "" }: TechnologyPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 1;

  const {
    data: queryData,
    isLoading,
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

  const technologies: Technology[] = queryData?.data || [];

  const filteredTechnologies = technologies.filter(technology => {
    const matchesSearch = technology.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTechnologies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTechnologies = filteredTechnologies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (searchTerm && currentPage > 1) {
    setCurrentPage(1);
  }

  if (isEmbedded) {
    return (
      <div className="mb-16 grid grid-cols-1 gap-6">
        {isLoading ? (
          <>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }
                }
              }}
              className="animate-pulse"
            >
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </motion.div>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }
                }
              }}
              className="animate-pulse"
            >
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </motion.div>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }
                }
              }}
              className="animate-pulse"
            >
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </motion.div>
          </>
        ) : filteredTechnologies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <NotFoundInline 
              onClearFilters={() => {

              }}
            />
          </motion.div>
        ) : (
          <>
            {paginatedTechnologies.map((technology, index) => (
              <motion.div
                key={technology.id}
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 40,
                    scale: 0.95
                  },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.7,
                      type: "spring",
                      stiffness: 80,
                      bounce: 0.2
                    }
                  }
                }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <TechnologyItem technology={technology} />
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    );
  }

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
        <div className="pb-20">
          
          {filteredTechnologies.length === 0 ? (
            <div>
              <NotFoundInline 
                onClearFilters={() => {

                }}
              />
            </div>
          ) : (
            <>
              {paginatedTechnologies.map((technology, index) => (
                <motion.div
                  key={technology.id}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 40,
                      scale: 0.95
                    },
                    show: { 
                      opacity: 1, 
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.7,
                        type: "spring",
                        stiffness: 80,
                        bounce: 0.2
                      }
                    }
                  }}
                  whileHover={{ 
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <TechnologyItem technology={technology} />
                </motion.div>
              ))}

              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8"
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </motion.div>
              )}
            </>
          )}
          
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ y: -3 }}
            className="mt-16 rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 p-8 text-center backdrop-blur-sm"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
            >
              Start Your Cardano2vn Journey Today
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="https://cardano2vn.io">
                <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                  Open Cardano2vn App
                </button>
              </Link>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </main>
  );
} 