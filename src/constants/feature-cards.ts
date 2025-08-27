export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  publishStatus: 'DRAFT' | 'PUBLISHED';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureCardEditorProps {
  featureCard?: FeatureCard;
  onSave: (data: {
    title: string;
    description: string;
    iconName: string;
    order: number;
    publishStatus: 'DRAFT' | 'PUBLISHED';
  }) => void;
  onCancel: () => void;
}

export const iconOptions = [
  { value: "Learn", label: "Learn (Graduation Cap)" },
  { value: "Check", label: "Check (Checkmark)" },
  { value: "Verify", label: "Verify (Shield)" },
];


