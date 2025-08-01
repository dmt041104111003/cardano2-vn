import { Edit, Trash2 } from 'lucide-react';
import { Tag, TagTableProps, formatDateTime } from '~/constants/tags';
import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTagName, setEditTagName] = useState('');

  useEffect(() => {
    if (editingTag) {
      setEditTagName(editingTag.name);
      setIsEditModalOpen(true);
    } else {
      setIsEditModalOpen(false);
      setEditTagName('');
    }
  }, [editingTag]);

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

  const handleEditClick = (tag: Tag) => {
    onEdit(tag);
  };

  const handleSaveEdit = () => {
    if (editingTag && editTagName.trim()) {
      onSave(editingTag.id, editTagName.trim());
      setIsEditModalOpen(false);
      setEditTagName('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditTagName('');
    onCancel();
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
                <div className="text-sm font-medium text-gray-900">{tag.name}</div>
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
                  <button
                    onClick={() => handleEditClick(tag)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit tag"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
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
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="Edit Tag"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editTagName" className="block text-sm font-medium text-gray-700 mb-1">
              Tag Name
            </label>
            <input
              id="editTagName"
              type="text"
              value={editTagName}
              onChange={(e) => setEditTagName(e.target.value)}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                }
              }}
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editTagName.trim()}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
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