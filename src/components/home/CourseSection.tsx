"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "~/constants/admin";
import CourseModal from "./CourseModal";
import { Pagination } from "~/components/ui/pagination";

type TabType = "latest" | "all";

export default function CourseSection() {
  const [activeTab, setActiveTab] = useState<TabType>("latest");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses");
      const data = await res.json();
      return data?.data || [];
    },
  });

  const courses = coursesData?.filter((c: Course) => c.isActive) || [];
  
  const latestCourses = courses
    .sort((a: Course, b: Course) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);
  
  const allCourses = courses.sort((a: Course, b: Course) => a.order - b.order);

  const currentCourses = activeTab === "latest" ? latestCourses : allCourses;
  const displayCourses = [...currentCourses];
  while (displayCourses.length < 3) displayCourses.push(null);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleEnroll = (courseName: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      setTimeout(() => {
        const courseSelect = document.querySelector('select[name="your-course"]') as HTMLSelectElement;
        if (courseSelect) {
          courseSelect.value = courseName;
          const event = new Event('change', { bubbles: true });
          courseSelect.dispatchEvent(event);
        }
      }, 500);
    }
  };

  const totalPages = Math.ceil(allCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allCourses, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "all") {
      setCurrentPage(1);
    }
  };

  return (
    <section id="courses" className="relative flex min-h-[80vh] items-center border-t border-gray-200 dark:border-white/10">
      <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-12 lg:px-8">
        <div className="relative">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">C2VN Courses</h2>
            </div>
            <p className="max-w-3xl text-lg text-gray-700 dark:text-gray-300">
              Discover our latest courses and educational resources for Cardano development.
            </p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex flex-wrap gap-1 sm:gap-2 md:gap-8 overflow-x-auto pb-2">
              <button
                onClick={() => handleTabChange("latest")}
                className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "latest"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                                     <span className="hidden sm:inline">3 Latest Courses</span>
                   <span className="sm:hidden">Latest</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("all")}
                className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                                     <span className="hidden sm:inline">All Courses</span>
                   <span className="sm:hidden">All</span>
                </div>
              </button>
            </nav>
          </div>

          {activeTab === "latest" ? (
            <div className="grid max-w-none gap-16 lg:grid-cols-3">
              {isLoading ? (
                [...Array(3)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))
              ) : (
                displayCourses.map((course, idx) =>
                  course ? (
                    <div
                      key={course.id}
                      className="rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.image || "/images/common/loading.png"}
                          alt={course.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/common/loading.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {course.title || course.name}
                        </h3>
                        {course.description && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                            {course.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                                                     <span className="text-sm text-gray-500 dark:text-gray-400">
                             {new Date(course.createdAt).toLocaleDateString("en-US", {
                               day: "2-digit",
                               month: "2-digit",
                               year: "numeric"
                             })}
                           </span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {course.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6 flex items-center justify-center min-h-[300px]">
                      <img src="/images/common/loading.png" alt="Loading" width={120} height={120} />
                    </div>
                  )
                )
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                [...Array(6)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
                             ) : paginatedCourses.length === 0 ? (
                 <div className="text-center py-12">
                   <div className="text-gray-500 dark:text-gray-400">
                     <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                                           <p className="text-lg font-medium">No courses available</p>
                      <p className="text-sm">Please check back later for new courses</p>
                   </div>
                 </div>
               ) : (
                 <>
                   {paginatedCourses.map((course: Course) => (
                                     <div
                     key={course.id}
                     className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                     onClick={() => handleCourseClick(course)}
                   >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={course.image || "/images/common/loading.png"}
                          alt={course.name}
                          className="h-16 w-16 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/common/loading.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {course.title || course.name}
                        </h3>
                        {course.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                     <span>
                             Created: {new Date(course.createdAt).toLocaleDateString("en-US", {
                               day: "2-digit",
                               month: "2-digit",
                               year: "numeric"
                             })}
                           </span>
                           <span>•</span>
                           <span>Order: {course.order}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {course.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={allCourses.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
        </div>
      </section>

      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEnroll={handleEnroll}
      />
    </section>
  );
}
