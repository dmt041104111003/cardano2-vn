"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectModal from "~/components/project-modal";

interface Project {
  id: string;
  title: string;
  description: string;
  href?: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  year: number;
  quarterly: string;
  fund?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROPOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group w-full rounded-sm border border-white/20 bg-gray-800/50 shadow-xl backdrop-blur-sm transition-all hover:border-white/40 hover:shadow-2xl cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex w-full">
          <div className="flex-grow border-l-4 bg-gray-900/60 border-green-500 rounded-l-lg">
            <div className="p-5">
              <div className="mb-3">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {project.fund && `${project.fund}: `}{project.title}
                </h3>
              </div>
              <p className="max-w-2xl text-sm text-gray-300 line-clamp-1">
                {project.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full min-w-[70px] justify-center ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  {project.href && (
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 transition-colors duration-200 hover:text-blue-300 hover:underline text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Proposal
                    </Link>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  Click to view details
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-32 flex-col justify-center bg-green-900/30 rounded-r-lg p-4">
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold text-green-300">{project.year}</div>
              <div className="text-xl font-bold text-green-300">{project.quarterly}</div>
              <div className="mt-6 text-xs font-medium text-green-300">{project.fund || 'No Fund'}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <ProjectModal
        project={project}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
} 