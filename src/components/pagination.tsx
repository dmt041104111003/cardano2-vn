"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }: Props) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }
  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <Button
        variant="transparent"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>First</span>
      </Button>
      
      <Button
        variant="transparent"
        size="sm"
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Previous</span>
      </Button>
      
      <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-800 dark:hover:text-blue-200"
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-800 dark:hover:text-blue-200"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      >
        <span>Last</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default Pagination;
