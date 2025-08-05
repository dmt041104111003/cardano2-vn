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
    <div className={`flex justify-center items-center mt-6 text-white `}>
      <Button
        className="bg-[#030711] border-0 rounded-[8px] text-white cursor-pointer flex items-center justify-center text-[16px] h-8 font-normal px-3 py-[1px] mx-2"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        <ArrowLeft className="w-2 h-2 object-contain" />
        <span className="mx-1">First</span>
      </Button>
      <Button
        className="bg-[#030711] border-0 rounded-[8px] text-white cursor-pointer flex items-center justify-center text-[16px] h-8 font-normal px-3 py-[1px] mx-2"
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
      >
        <ArrowLeft className="w-2 h-2 object-contain" />
        <span className="mx-1">Previous</span>
      </Button>
      <span className="text-[16px] font-light leading-8 min-w-[110px] text-center">
        {currentPage} of {totalPages}
      </span>
      <Button
        className="bg-[#030711] border-0 rounded-[8px] text-white cursor-pointer flex items-center justify-center text-[16px] h-8 font-normal px-3 py-[1px] mx-2"
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
      >
        <span className="mx-1">Next</span>
        <ArrowRight className="w-2 h-2 object-contain" />
      </Button>
      <Button
        className="bg-[#030711] border-0 rounded-[8px] text-white cursor-pointer flex items-center justify-center text-[16px] h-8 font-normal px-3 py-[1px] mx-2"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      >
        <span className="mx-1">Last</span>
        <ArrowRight className="w-2 h-2 object-contain" />
      </Button>
    </div>
  );
};

export default Pagination;
