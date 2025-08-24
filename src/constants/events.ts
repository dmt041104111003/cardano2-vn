export interface Event {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  orderNumber: number;
}

export interface EventCardProps {
  event: Event;
  index: number;
  editMode: boolean;
  onEditClick?: (index: number) => void;
  onUpload?: (file: File, index: number) => void;
  className?: string;
}

export interface EventImageModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  index: number;
  onSave: (index: number, updatedEvent: Partial<Event>) => void;
}
