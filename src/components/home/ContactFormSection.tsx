"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToastContext } from '~/components/toast-provider';
import { ContactForm } from './ContactForm';
import { ContactFormData, FormErrors } from '~/constants/contact';

export default function ContactFormSection() {
  const { data: session } = useSession();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState<ContactFormData>({
    "your-name": "",
    "your-number": "",
    "your-email": "",
    "address-wallet": "",
    "email-intro": "",
    "event-location": "",
    "your-course": "",
    message: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
   
        const sessionUser = session?.user as { address?: string; email?: string };
        const address = sessionUser?.address;
        const email = sessionUser?.email;

        
        if (!address && !email) {
          console.log('No address or email in session');
          return;
        }
        
        const url = new URL('/api/auth/me', window.location.origin);
        if (address) url.searchParams.set('address', address);
        if (email) url.searchParams.set('email', email);
        
        console.log('API URL:', url.toString());
        
        const response = await fetch(url.toString());
 
        
        if (response.ok) {
          const userData = await response.json();

          if (userData && userData.user && (userData.user.email || userData.user.address)) {
            console.log('User data found:', userData.user);
            setFormData(prev => {
              const newData = {
                ...prev,
                "your-email": userData.user.email || "",
                "address-wallet": userData.user.address || ""
              };
              console.log('Form data before update:', prev);
              console.log('Form data after update:', newData);
              return newData;
            });
          } else {
            console.log('No user data found or user not logged in');
            console.log('userData:', userData);
            console.log('userData.user:', userData?.user);
          }
        } else {
          console.log('API response not ok:', response.status);
          const errorText = await response.text();
          console.log('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData["your-name"].trim()) {
      newErrors["your-name"] = "Name is required";
    }

    const email = formData["your-email"].trim();
    if (!email) {
      newErrors["your-email"] = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors["your-email"] = "Please enter a valid email address";
      }
    }

    if (!formData["your-course"].trim()) {
      newErrors["your-course"] = "Course selection is required";
    }

    const hasPhone = formData["your-number"].trim() !== "";
    const hasWallet = formData["address-wallet"].trim() !== "";

   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    if (errors.contact && (name === "your-number" || name === "your-email" || name === "address-wallet")) {
      setErrors(prev => ({
        ...prev,
        contact: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const scriptURL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL_1 || '';
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setFormData({
          "your-name": "",
          "your-number": "",
          "your-email": "",
          "address-wallet": "",
          "email-intro": "",
          "event-location": "",
          "your-course": "",
          message: ""
        });
        setErrors({});
        showSuccess("Thank you! Your message has been sent successfully.");
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Send error:', error);
      showError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-[90vh] items-center overflow-hidden border-t border-gray-200 dark:border-white/10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent"></div>
      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 dark:from-white to-transparent"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">Register for a C2VN Course</h2>
            </div>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-blue-100">
              Join our comprehensive Cardano courses and learn from industry experts. 
              Choose your path and start your blockchain journey today.
            </p>
       
          </div>
          <div className="relative">
            <ContactForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              captchaValid={captchaValid}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCaptchaChange={setCaptchaValid}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 