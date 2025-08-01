// Contact Form Components Interfaces
export interface ContactFormProps {
  formData: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  captchaValid: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCaptchaChange: (isValid: boolean) => void;
}

// Contact Form Data Types
export interface ContactFormData {
  "your-name": string;
  "your-number": string;
  "your-email": string;
  "event-location": string;
  "address-wallet": string;
  "email-intro": string;
  message: string;
}

export interface FormErrors {
  "your-name"?: string;
  contact?: string;
} 