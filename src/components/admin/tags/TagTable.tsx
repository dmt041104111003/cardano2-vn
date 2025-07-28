import { Edit, Trash2 } from 'lucide-react';
import { Tag } from '~/constants/tags';
import { useState } from 'react';
import Modal from '../common/Modal';

interface TagTableProps {
  tags: Tag[];
  editingTag: Tag | null;
  onEdit: (tag: Tag) => void;
  onSave: (tagId: string, newName: string) => void;
  onDelete: (tagId: string) => void;
  onCancel: () => void;
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function TagTable({
  tags,
  editingTag,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: TagTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTagToDelete, setSelectedTagToDelete] = useState<Tag | null>(null);

  const handleDeleteClick = (tag: Tag) => {
    setSelectedTagToDelete(tag);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTagToDelete) {
      onDelete(selectedTagToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedTagToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tag Name
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posts
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tags.map((tag) => (
            <tr key={tag.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTag?.id === tag.id ? (
                  <input
                    type="text"
                    defaultValue={tag.name}
                    placeholder="Enter tag name"
                    title="Edit tag name"
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onBlur={(e) => onSave(tag.id, e.target.value)}
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{tag.name}</div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tag.postCount} posts
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(tag.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {editingTag?.id === tag.id ? (
                    <button
                      onClick={onCancel}
                      className="text-gray-400 hover:text-gray-600"
                      title="Cancel edit"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => onEdit(tag)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit tag"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(tag)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete tag"
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
        title="Delete Tag"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Tag</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this tag?</p>
            </div>
          </div>
          
          {selectedTagToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Tag to delete:</p>
              <p className="font-medium text-gray-900">{selectedTagToDelete.name}</p>
              <p className="text-sm text-gray-500">{selectedTagToDelete.postCount} posts using this tag</p>
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