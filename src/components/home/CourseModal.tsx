"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useState } from "react";
import { Course } from "~/constants/admin";
import CourseModalText from "./CourseModalText";
import CourseModalTitle from "./CourseModalTitle";

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (courseName: string) => void;
}

export default function CourseModal({ course, isOpen, onClose, onEnroll }: CourseModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !course) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                  Course Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Close"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] transparent-scrollbar">
                <div className="space-y-6">
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <img
                      src={course.image || "/images/common/loading.png"}
                      alt={course.title || course.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/common/loading.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                                     <div>
                     <CourseModalTitle
                       title={course.title || course.name}
                       maxLength={50}
                     />
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {course.name}
                      </span>
                      <span>Order: {course.order}</span>
                      <span>
                        Created: {new Date(course.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                                     {course.description && (
                     <div>
                       <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                         Course Description
                       </h4>
                       <CourseModalText
                         text={course.description}
                         maxLength={200}
                       />
                     </div>
                   )}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                                         <button
                       onClick={() => {
                         if (onEnroll && course) {
                           onEnroll(course.name);
                         }
                         onClose();
                       }}
                       className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                     >
                       Enroll in Course
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
