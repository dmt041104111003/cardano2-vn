"use client";

import { Edit, Trash2, Eye } from "lucide-react";

interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface TechnologyTableProps {
  technologies: Technology[];
  onEdit: (technology: Technology) => void;
  onDelete: (technology: Technology) => void;
  onViewDetails: (technology: Technology) => void;
}

export function TechnologyTable({ technologies, onEdit, onDelete, onViewDetails }: TechnologyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technology
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Link
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
          {technologies.map((technology) => (
            <tr key={technology.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex flex-col max-w-xs">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-48">
                    {technology.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1 max-w-48">
                    {technology.name}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1 max-w-48">
                    {technology.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <a 
                  href={technology.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-900 truncate block max-w-xs"
                >
                  {technology.href}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(technology.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(technology.updatedAt).toLocaleString('en-GB', {
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
                    onClick={() => onViewDetails(technology)}
                    className="text-green-600 hover:text-green-900"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(technology)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit technology"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(technology)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete technology"
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