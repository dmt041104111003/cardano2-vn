'use client';

import { useState } from 'react';
import { Mail, User, MessageSquare, FileText } from 'lucide-react';
import { useToastContext } from '~/components/toast-provider';
import { ContactFormData, FormErrors } from '~/constants/contact';
import ContactInput from './ContactInput';
import ContactSubmitButton from './ContactSubmitButton';
import { validateForm } from '~/utils/validation';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError('Please fix the errors below', 'Please check all fields and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Message sent!', 'Thank you for contacting us. We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      showError('Failed to send message', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContactInput
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            icon={User}
            error={errors.name}
          />
          <ContactInput
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            type="email"
            icon={Mail}
            error={errors.email}
          />
        </div>

        <ContactInput
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Subject"
          icon={FileText}
          error={errors.subject}
        />

        <ContactInput
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Your Message"
          icon={MessageSquare}
          error={errors.message}
          isTextarea
        />

        <ContactSubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  );
} 