"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToastContext } from '~/components/toast-provider';
import { ContactForm } from './ContactForm';
import ContactFormManager from './ContactFormManager';
import { ContactFormData, FormErrors } from '~/constants/contact';
import ContactFormQuoteBlock from './ContactFormQuoteBlock';
import ContactFormImage from './ContactFormImage';

type TabType = "form" | "manage";

export default function ContactFormSection() {
  const { data: session } = useSession();
  const { showSuccess, showError } = useToastContext();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("form");
  const [selectedCourseImage, setSelectedCourseImage] = useState<string>('');
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }
      
      const sessionUser = session.user as { address?: string; email?: string };
      const url = new URL('/api/auth/me', window.location.origin);
      if (sessionUser.address) url.searchParams.set('address', sessionUser.address);
      if (sessionUser.email) url.searchParams.set('email', sessionUser.email);

      try {
        const response = await fetch(url.toString());
                 if (response.ok) {
           const data = await response.json();
           console.log('API response data:', data);
           setIsAdmin(data.user?.role === 'ADMIN');
         }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session]);
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

  const handleCourseChange = (courseName: string) => {
    console.log('handleCourseChange called with:', courseName);
    fetch('/api/admin/courses')
      .then(response => response.json())
      .then(courses => {
        console.log('Fetched courses:', courses);
        const selectedCourse = courses.find((course: any) => course.name === courseName);
        console.log('Selected course:', selectedCourse);
        const imageUrl = selectedCourse?.image || '';
        console.log('Setting image URL:', imageUrl);
        setSelectedCourseImage(imageUrl);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  console.log('selectedCourseImage:', selectedCourseImage);
  const backgroundStyle = {
    backgroundImage: selectedCourseImage ? `url(${selectedCourseImage})` : 'linear-gradient(to bottom right, rgb(239 246 255), rgb(224 231 255))',
    backgroundSize: selectedCourseImage ? 'contain' : 'auto',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  console.log('backgroundStyle:', backgroundStyle);

  return (
    <section
      id="contact"
      className="relative flex min-h-[90vh] items-center overflow-hidden border-t border-gray-200 dark:border-white/10"
    >
      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className={`grid items-center gap-12 ${activeTab === "manage" ? "lg:grid-cols-1" : "lg:grid-cols-2"}`}>
          {activeTab !== "manage" && (
            <div className="relative flex flex-col h-full justify-center">
              <div className="relative w-full h-[600px] lg:h-[600px]">
                <ContactFormImage imageUrl={selectedCourseImage} />
                {/* Overlay text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
                  <ContactFormQuoteBlock />
                </div>
              </div>
            </div>
          )}
          <div className={`relative ${activeTab === "manage" ? "lg:col-span-1" : "lg:col-span-1"}`}>
            {isAdmin && (
              <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                <nav className="-mb-px flex flex-wrap gap-1 sm:gap-2 md:gap-8 overflow-x-auto pb-2">
                  <button
                    onClick={() => handleTabChange("form")}
                    className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === "form"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Contact Form</span>
                      <span className="sm:hidden">Form</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTabChange("manage")}
                    className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === "manage"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Manage Options</span>
                      <span className="sm:hidden">Manage</span>
                    </div>
                  </button>
                </nav>
              </div>
            )}
            {activeTab === "form" ? (
              <ContactForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                captchaValid={captchaValid}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCaptchaChange={setCaptchaValid}
                onCourseChange={handleCourseChange}
              />
            ) : (
              <ContactFormManager />
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 