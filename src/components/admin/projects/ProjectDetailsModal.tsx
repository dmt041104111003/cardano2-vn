import Modal from "~/components/admin/common/Modal";
import { Project, ProjectDetailsModalProps } from "~/constants/projects";

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Details"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {project.fund && `${project.fund}: `}{project.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              project.status === 'APPROVED' ? 'bg-yellow-100 text-yellow-800' :
              project.status === 'PROPOSED' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {project.status.replace('_', ' ')}
            </span>
            <span>Year: {project.year}</span>
            <span>Quarter: {project.quarterly}</span>
            {project.fund && <span>Fund: {project.fund}</span>}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Created:</span>
            <span className="ml-2 text-gray-600">
              {project.createdAt ? new Date(project.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Updated:</span>
            <span className="ml-2 text-gray-600">
              {project.updatedAt ? new Date(project.updatedAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </span>
          </div>
        </div>

        {project.href && (
          <div className="pt-4 border-t border-gray-200">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Full Proposal
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
} 