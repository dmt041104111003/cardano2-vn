'use client';

import Modal from '~/components/admin/common/Modal';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mediaName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, mediaName }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Media" maxWidth="max-w-md">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Delete Media File
        </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-900">&quot;{mediaName}&quot;</span>? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 inline mr-2" />
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
} 