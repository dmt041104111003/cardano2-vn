"use client";

import { FeatureCard } from "~/constants/feature-cards";
import { Learn, Check, Verify } from "~/components/icons";
import Modal from "~/components/admin/common/Modal";

interface FeatureCardDetailsModalProps {
  featureCard: FeatureCard | null;
  isOpen: boolean;
  onClose: () => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Learn":
      return <Learn color="blue" />;
    case "Check":
      return <Check color="blue" />;
    case "Verify":
      return <Verify color="blue" />;
    default:
      return <Learn color="blue" />;
  }
};

const getStatusBadge = (status: string) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  switch (status) {
    case "PUBLISHED":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Published
        </span>
      );
    case "DRAFT":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Draft
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>
      );
  }
};

export default function FeatureCardDetailsModal({ featureCard, isOpen, onClose }: FeatureCardDetailsModalProps) {
  if (!featureCard) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feature Card Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-blue-50 rounded-lg">
            {getIconComponent(featureCard.iconName)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{featureCard.title}</h3>
            <p className="text-sm text-gray-500">Icon: {featureCard.iconName}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
            {featureCard.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <p className="text-sm text-gray-900">{featureCard.order}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div>{getStatusBadge(featureCard.publishStatus)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <p className="text-sm text-gray-900">
              {featureCard.createdAt ? new Date(featureCard.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
            <p className="text-sm text-gray-900">
              {featureCard.updatedAt ? new Date(featureCard.updatedAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
