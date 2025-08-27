"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import { ProjectModalProps, Project } from '~/constants/projects';

export const generateProjectMetadata = (project: Project): Metadata => ({
  title: `${project.fund || 'Project'}: ${project.title}`,
  description: project.description,
  keywords: ["Cardano", "project", "proposal", project.fund || "", project.status.toLowerCase()],
  openGraph: {
    title: `${project.fund || 'Project'}: ${project.title}`,
    description: project.description,
    type: "article",
    url: project.href,
  },
});

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Update document title when modal opens
  useEffect(() => {
    if (isOpen) {
      const originalTitle = document.title;
      document.title = `${project.fund || 'Project'}: ${project.title}`;
      
      return () => {
        document.title = originalTitle;
      };
    }
  }, [isOpen, project]);

  return (
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto transparent-scrollbar z-[9999999]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-[40px] shadow-2xl">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Details
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.fund && `${project.fund}: `}{project.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span>Year: {project.year}</span>
                      <span>Quarter: {project.quarterly}</span>
                      {project.fund && <span>Fund: {project.fund}</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {new Date(project.createdAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Updated:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {new Date(project.updatedAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {project.href && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Full Proposal
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
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
              zIndex: 9999999
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
      )}
    </AnimatePresence>
  );
} 