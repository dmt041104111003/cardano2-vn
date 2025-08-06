import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Modal from '../common/Modal';
import { EventLocation, EventLocationTableProps } from '~/constants/admin';

export function EventLocationTable({
  eventLocations = [],
  onEdit,
  onDelete,
}: EventLocationTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLocationToDelete, setSelectedLocationToDelete] = useState<EventLocation | null>(null);

  const handleDeleteClick = (location: EventLocation) => {
    setSelectedLocationToDelete(location);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLocationToDelete) {
      onDelete(selectedLocationToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedLocationToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Array.isArray(eventLocations) && eventLocations.map((location) => (
            <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{location.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(location)}
                    className="text-blue-600 hover:text-blue-900"
                    title={`Edit ${location.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(location)}
                    className="text-red-600 hover:text-red-900"
                    title={`Delete ${location.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Event Location"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Event Location</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this event location?</p>
            </div>
          </div>
          
          {selectedLocationToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Event location to delete:</p>
              <p className="font-medium text-gray-900">{selectedLocationToDelete.name}</p>
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