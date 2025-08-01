"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import { useState } from 'react';
import Modal from '../common/Modal';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTechnologyToDelete, setSelectedTechnologyToDelete] = useState<Technology | null>(null);

  const handleDeleteClick = (technology: Technology) => {
    setSelectedTechnologyToDelete(technology);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTechnologyToDelete) {
      onDelete(selectedTechnologyToDelete);
      setIsDeleteModalOpen(false);
      setSelectedTechnologyToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
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
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex-shrink-0 h-12 w-12">
                  {technology.image ? (
                    <img
                      src={technology.image}
                      alt={technology.title}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {!technology.image && (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-gray-400 text-xs">No img</span>
                    </div>
                  )}
                </div>
              </td>
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
                    onClick={() => handleDeleteClick(technology)}
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
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Technology"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Technology</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this technology?</p>
            </div>
          </div>
          
          {selectedTechnologyToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Technology to delete:</p>
              <p className="font-medium text-gray-900">{selectedTechnologyToDelete.title}</p>
              <p className="text-sm text-gray-500">{selectedTechnologyToDelete.name}</p>
              <p className="text-sm text-gray-500">{selectedTechnologyToDelete.description}</p>
            </div>
          )}
          
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone.
          </p>
          
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 