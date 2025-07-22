import { Edit, Trash2 } from 'lucide-react';
import { Tag } from '~/constants/tags';

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
                    onClick={() => onDelete(tag.id)}
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
    </div>
  );
} 