import Modal from "~/components/admin/common/Modal";

interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface TechnologyDetailsModalProps {
  technology: Technology | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TechnologyDetailsModal({ technology, isOpen, onClose }: TechnologyDetailsModalProps) {
  if (!technology) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Technology Details"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {technology.title}
          </h3>
          <p className="text-lg text-gray-600 mb-2">
            {technology.name}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {technology.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Created:</span>
            <span className="ml-2 text-gray-600">
              {new Date(technology.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Updated:</span>
            <span className="ml-2 text-gray-600">
              {new Date(technology.updatedAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {technology.image && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Image</h4>
            <div className="max-w-md">
              <img 
                src={technology.image} 
                alt={technology.title}
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <a
            href={technology.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Technology
          </a>
        </div>
      </div>
    </Modal>
  );
} 