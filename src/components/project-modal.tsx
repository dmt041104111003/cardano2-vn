"use client";

import { useEffect } from "react";
import Link from "next/link";
import Modal from "~/components/admin/common/Modal";
import { Metadata } from "next";

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

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Details"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {project.fund && `${project.fund}: `}{project.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
            <span>Year: {project.year}</span>
            <span>Quarter: {project.quarterly}</span>
            {project.fund && <span>Fund: {project.fund}</span>}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Created:</span>
            <span className="ml-2 text-gray-600">
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
            <span className="font-medium text-gray-900">Updated:</span>
            <span className="ml-2 text-gray-600">
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
          <div className="pt-4 border-t border-gray-200">
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
    </Modal>
  );
} 