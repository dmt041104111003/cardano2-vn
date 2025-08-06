import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Modal from '../common/Modal';
import { Course, CourseTableProps } from '~/constants/admin';

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
      <table className="min-w-[1200px] md:min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
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
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">No image</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{course.name}</div>
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