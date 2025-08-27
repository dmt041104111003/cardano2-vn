"use client";

import { useState } from "react";
import { FeatureCard } from "~/constants/feature-cards";
import { Learn, Check, Verify } from "~/components/icons";
import { Eye, Edit, Trash2 } from "lucide-react";
import Modal from "../common/Modal";

interface FeatureCardTableProps {
  featureCards: FeatureCard[];
  onEdit: (featureCard: FeatureCard) => void;
  onDelete: (featureCard: FeatureCard) => void;
  onViewDetails: (featureCard: FeatureCard) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Learn":
      return <Learn color="blue" />;
    case "Check":
      return <Check color="blue" />;
    case "Verify":
      return <Verify color="blue" />;
    default:
      return <Learn color="blue" />;
  }
};

const getStatusBadge = (status: string) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  switch (status) {
    case "PUBLISHED":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Published
        </span>
      );
    case "DRAFT":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Draft
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>
      );
  }
};

export default function FeatureCardTable({ featureCards, onEdit, onDelete, onViewDetails }: FeatureCardTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFeatureCardToDelete, setSelectedFeatureCardToDelete] = useState<FeatureCard | null>(null);

  const handleDeleteClick = (featureCard: FeatureCard) => {
    setSelectedFeatureCardToDelete(featureCard);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFeatureCardToDelete) {
      onDelete(selectedFeatureCardToDelete);
      setIsDeleteModalOpen(false);
      setSelectedFeatureCardToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Icon & Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {featureCards.map((featureCard) => (
            <tr key={featureCard.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    {getIconComponent(featureCard.iconName)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {featureCard.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {featureCard.iconName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {featureCard.description}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {featureCard.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(featureCard.publishStatus)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onViewDetails(featureCard)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(featureCard)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit feature card"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                                     <button
                     onClick={() => handleDeleteClick(featureCard)}
                     className="text-red-600 hover:text-red-900"
                     title="Delete feature card"
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
         title="Delete Feature Card"
       >
         <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
               <Trash2 className="w-5 h-5 text-red-600" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-gray-900">Delete Feature Card</h3>
               <p className="text-sm text-gray-600">Are you sure you want to delete this feature card?</p>
             </div>
           </div>
           
           {selectedFeatureCardToDelete && (
             <div className="bg-gray-50 rounded-lg p-3">
               <p className="text-sm text-gray-500">Feature card to delete:</p>
               <p className="font-medium text-gray-900">{selectedFeatureCardToDelete.title}</p>
               <p className="text-sm text-gray-500">{selectedFeatureCardToDelete.description}</p>
               <p className="text-sm text-gray-500">Status: {selectedFeatureCardToDelete.publishStatus}</p>
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


