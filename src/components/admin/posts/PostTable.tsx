import { Edit, Trash2 } from 'lucide-react';
import { Post } from '~/constants/posts';
import { Tag } from '~/constants/tags';
import { useState } from 'react';
import Modal from '../common/Modal';

interface PostTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onStatusChange?: (postId: string, newStatus: 'published' | 'draft' | 'archived') => void;
}

export function PostTable({
  posts = [],
  onEdit,
  onDelete,
}: PostTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPostToDelete, setSelectedPostToDelete] = useState<Post | null>(null);

  const handleDeleteClick = (post: Post) => {
    setSelectedPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPostToDelete) {
      onDelete(selectedPostToDelete.slug || selectedPostToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedPostToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] md:min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Post
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Update
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(posts) && posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{post.author}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                  ${(post.status && String(post.status).toLowerCase() === 'published') ? 'bg-green-100 text-green-700' : ''}
                  ${(post.status && String(post.status).toLowerCase() === 'draft') ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${(post.status && String(post.status).toLowerCase() === 'archived') ? 'bg-gray-100 text-gray-700' : ''}
                `}>
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(post.tags) && post.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={typeof tag === 'object' && tag !== null && (tag as Tag).id ? (tag as Tag).id : index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {typeof tag === 'object' && tag !== null && (tag as Tag).name ? (tag as Tag).name : String(tag)}
                    </span>
                  ))}
                  {Array.isArray(post.tags) && post.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {post.createdAt ?
                  new Date(post.createdAt).toLocaleString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: false
                  })
                  : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {post.updatedAt ?
                  new Date(post.updatedAt).toLocaleString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: false
                  })
                  : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="text-blue-600 hover:text-blue-900"
                    title={`Edit ${post.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post)}
                    className="text-red-600 hover:text-red-900"
                    title={`Delete ${post.title}`}
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
        title="Delete Post"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this post?</p>
            </div>
          </div>
          
          {selectedPostToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Post to delete:</p>
              <p className="font-medium text-gray-900">{selectedPostToDelete.title}</p>
              <p className="text-sm text-gray-500">Author: {selectedPostToDelete.author}</p>
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