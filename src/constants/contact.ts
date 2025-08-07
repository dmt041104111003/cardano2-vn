// Contact Form Components Interfaces
export interface ContactFormProps {
  formData: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  captchaValid: boolean;
  captchaKey?: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCaptchaChange: (isValid: boolean) => void;
  onCourseChange?: (courseName: string) => void;
}

// Contact Form Data Types
export interface ContactFormData {
  "your-name": string;
  "your-number": string;
  "your-email": string;
  "event-location": string;
  "address-wallet": string;
  "email-intro": string;
  "your-course": string;
  message: string;
}

export interface FormErrors {
  "your-name"?: string;
  "your-email"?: string;
  "your-course"?: string;
  contact?: string;
} 