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
          initial={{
              opacity: 0,
              scaleX: 0,
              filter: "blur(12px)",
              transformOrigin: "right",
          }}
          animate={{
              opacity: 1,
              scaleX: 1,
              filter: "blur(0px)",
              transformOrigin: "right",
          }}
          exit={{
              opacity: 0,
              scaleX: 0,
              filter: "blur(12px)",
              transformOrigin: "right",
          }}
          transition={{
              duration: 0.6,
              ease: [0.25, 1, 0.5, 1],
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto transparent-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-[40px] shadow-2xl">
                            <div className="p-8">
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
            
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              onClick={onClose}
              className="absolute button"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '4em',
                height: '4em',
                border: 'none',
                background: 'rgba(180, 83, 107, 0.11)',
                borderRadius: '5px',
                transition: 'background 0.5s',
                zIndex: 50
              }}
            >
              <span 
                className="X"
                style={{
                  content: "",
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2em',
                  height: '1.5px',
                  backgroundColor: 'rgb(255, 255, 255)',
                  transform: 'translateX(-50%) rotate(45deg)'
                }}
              ></span>
              <span 
                className="Y"
                style={{
                  content: "",
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2em',
                  height: '1.5px',
                  backgroundColor: '#fff',
                  transform: 'translateX(-50%) rotate(-45deg)'
                }}
              ></span>
              <div 
                className="close"
                style={{
                  position: 'absolute',
                  display: 'flex',
                  padding: '0.8rem 1.5rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateX(-50%)',
                  top: '-70%',
                  left: '50%',
                  width: '3em',
                  height: '1.7em',
                  fontSize: '12px',
                  backgroundColor: 'rgb(19, 22, 24)',
                  color: 'rgb(187, 229, 236)',
                  border: 'none',
                  borderRadius: '3px',
                  pointerEvents: 'none',
                  opacity: '0'
                }}
              >
                Close
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
