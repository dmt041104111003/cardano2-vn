"use client";

import { Edit, Trash2 } from "lucide-react";

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

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewDetails: (project: Project) => void;
}

export function ProjectTable({ projects, onEdit, onDelete, onViewDetails }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year/Quarter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fund
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex flex-col max-w-xs">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">
                    {project.fund && `${project.fund}: `}{project.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {project.description}
                  </div>
                  <button
                    onClick={() => onViewDetails(project)}
                    className="text-blue-600 hover:text-blue-900 text-xs mt-1 text-left"
                  >
                    View Details
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'APPROVED' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'PROPOSED' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {project.year} {project.quarterly}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {project.fund || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(project.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(project.updatedAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(project)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit project"
                  >
                                          <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 