"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import { useState } from 'react';
import Modal from '../common/Modal';
import { Tab, Member } from "~/constants/members";
import { TabsTableProps } from "~/constants/tabs";

export function TabsTable({ tabs, onEdit, onDelete, onView }: TabsTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTabToDelete, setSelectedTabToDelete] = useState<Tab | null>(null);

  const handleDeleteClick = (tab: Tab) => {
    setSelectedTabToDelete(tab);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTabToDelete && selectedTabToDelete.id) {
      onDelete(selectedTabToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedTabToDelete(null);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tab Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tabs.map((tab) => (
              <tr key={tab.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tab.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm text-gray-900">
                      {tab.members?.length || 0} members
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tab.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tab.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tab.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(tab)}
                      className="text-green-600 hover:text-green-900"
                      title={`View ${tab.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(tab)}
                      className="text-blue-600 hover:text-blue-900"
                      title={`Edit ${tab.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tab)}
                      className="text-red-600 hover:text-red-900"
                      title={`Delete ${tab.name}`}
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
      
             <Modal
         isOpen={isDeleteModalOpen}
         onClose={() => setIsDeleteModalOpen(false)}
         title="Delete Tab"
         maxWidth="max-w-md"
       >
         <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
               <Trash2 className="w-5 h-5 text-red-600" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-gray-900">Delete Tab</h3>
               <p className="text-sm text-gray-600">Are you sure you want to delete this tab?</p>
             </div>
           </div>
           
           {selectedTabToDelete && (
             <div className="bg-gray-50 rounded-lg p-3">
               <p className="text-sm text-gray-500">Tab to delete:</p>
               <p className="font-medium text-gray-900">{selectedTabToDelete.name}</p>
               <p className="text-sm text-gray-500">Order: {selectedTabToDelete.order}</p>
               <p className="text-sm text-gray-500">{selectedTabToDelete.members?.length || 0} members</p>
             </div>
           )}
           
           <p className="text-sm text-red-600 font-medium">
             Members in this tab will be moved to "No Tab". This action cannot be undone.
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