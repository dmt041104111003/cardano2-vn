import { ContactFormData, FormErrors } from '~/constants/contact';

export const validateField = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      if (value.trim().length > 50) return 'Name must be less than 50 characters';
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
      break;
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
      break;
    case 'subject':
      if (!value.trim()) return 'Subject is required';
      if (value.trim().length < 5) return 'Subject must be at least 5 characters';
      if (value.trim().length > 100) return 'Subject must be less than 100 characters';
      break;
    case 'message':
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
      break;
  }
  return undefined;
};

export const validateForm = (formData: ContactFormData): FormErrors => {
  const errors: FormErrors = {};
  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key as keyof ContactFormData]);
    if (error) {
      errors[key as keyof FormErrors] = error;
    }
  });
  return errors;
}; 