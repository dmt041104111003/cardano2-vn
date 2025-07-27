import Modal from "~/components/admin/common/Modal";

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ title, message, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
} 