import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Modal from '../common/Modal';
import { Course, CourseTableProps } from '~/constants/admin';

function TruncatedText({ text, maxLength = 50 }: { text?: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) {
    return null;
  }
  
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded ? text.substring(0, maxLength) + '...' : text;
  
  return (
    <div className="text-sm text-gray-900 dark:text-white">
      <span>{displayText}</span>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs"
          title={isExpanded ? "Show less" : "Show more"}
        >
          {isExpanded ? "..." : "..."}
        </button>
      )}
    </div>
  );
}

export function CourseTable({
  courses = [],
  onEdit,
  onDelete,
}: CourseTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourseToDelete, setSelectedCourseToDelete] = useState<Course | null>(null);

  const handleDeleteClick = (course: Course) => {
    setSelectedCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCourseToDelete) {
      onDelete(selectedCourseToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedCourseToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Publish Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Array.isArray(courses) && courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4">
                <TruncatedText text={course.title} maxLength={30} />
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.publishStatus === 'PUBLISHED' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {course.publishStatus || 'DRAFT'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(course)}
                    className="text-blue-600 hover:text-blue-900"
                    title={`Edit ${course.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(course)}
                    className="text-red-600 hover:text-red-900"
                    title={`Delete ${course.name}`}
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
        title="Delete Course"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Course</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this course?</p>
            </div>
          </div>
          
          {selectedCourseToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Course to delete:</p>
              <p className="font-medium text-gray-900">{selectedCourseToDelete.name}</p>
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