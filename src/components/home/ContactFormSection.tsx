"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToastContext } from '~/components/toast-provider';
import { ContactForm } from './ContactForm';
import ContactFormManager from './ContactFormManager';
import { ContactFormData, FormErrors } from '~/constants/contact';
import ContactFormQuoteBlock from './ContactFormQuoteBlock';
import ContactFormImage from './ContactFormImage';
import ContactFormTabs from './ContactFormTabs';
import ContactFormSkeleton from './ContactFormSkeleton';
import { useQuery } from '@tanstack/react-query';

type TabType = "form" | "manage";

export default function ContactFormSection() {
  const { data: session } = useSession();
  const { showSuccess, showError } = useToastContext();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("form");
  const [selectedCourseImage, setSelectedCourseImage] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }
      
      const sessionUser = session.user as { address?: string; email?: string };
      const url = new URL('/api/user', window.location.origin);
      if (sessionUser.address) url.searchParams.set('address', sessionUser.address);
      if (sessionUser.email) url.searchParams.set('email', sessionUser.email);

      try {
        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data);
          console.log('ContactFormSection - data:', data);
          console.log('ContactFormSection - role:', data?.data?.role?.name);
          setIsAdmin(data?.data?.role?.name === 'ADMIN');
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
  const [captchaKey, setCaptchaKey] = useState(0); 

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
        
        const url = new URL('/api/user', window.location.origin);
        if (address) url.searchParams.set('address', address);
        if (email) url.searchParams.set('email', email);
        
        console.log('API URL:', url.toString());
        
        const response = await fetch(url.toString());
 
        
        if (response.ok) {
          const userData = await response.json();

          if (userData && userData.data && (userData.data.email || userData.data.address)) {
            console.log('User data found:', userData.data);
            setFormData(prev => {
              const newData = {
                ...prev,
                "your-email": userData.data.email || "",
                "address-wallet": userData.data.address || ""
              };
              console.log('Form data before update:', prev);
              console.log('Form data after update:', newData);
              return newData;
            });
          } else {
            console.log('No user data found or user not logged in');
            console.log('userData:', userData);
            console.log('userData.data:', userData?.data);
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

  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['contact-courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      return data?.data || [];
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse && formData["your-course"]) {
      const course = (courses as any[]).find((c: any) => c.name === formData["your-course"]);
      if (course) {
        setSelectedCourse(course);
        setSelectedCourseImage(course.image || '');
      }
    }
  }, [courses, selectedCourse, formData["your-course"]]);

  const memoizedContactFormManager = useMemo(() => {
    if (!isAdmin) {
      return null;
    }
    
    if (coursesError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">
            Error loading courses: {(coursesError as Error).message}
          </p>
        </div>
      );
    }
    
    return <ContactFormManager />;
  }, [coursesError, isAdmin]);

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

  const handleCourseChange = useCallback((courseName: string) => {
    const selected = (courses as any[]).find((course: any) => course.name === courseName);
    setSelectedCourse(selected || null);
    const imageUrl = selected?.image || '';
    setSelectedCourseImage(imageUrl);
  }, [courses]);

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
        setCaptchaValid(false);
        setCaptchaKey(prev => prev + 1);
        setSelectedCourse(null);
        setSelectedCourseImage('');
        showSuccess("Thank you! Your message has been sent successfully.");
        
        setTimeout(() => {
          showSuccess("Please check your email for confirmation. If you don't see it within a few minutes, please check your spam folder or resend the form. For any issues, please contact cardano2vn@gmail.com");
        }, 1000);
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
          {activeTab === "form" && (
            <div className="relative flex flex-col h-full justify-center">
              <div className="relative w-full h-[600px] lg:h-[600px]">
                <ContactFormImage imageUrl={selectedCourseImage} />
                {/* Overlay text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
                  <ContactFormQuoteBlock
                    title={selectedCourse?.title}
                    description={selectedCourse?.description}
                    hasSelectedCourse={!!selectedCourse}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={`relative ${activeTab === "manage" ? "lg:col-span-1" : "lg:col-span-1"}`}>
            {isAdmin && (
              <ContactFormTabs activeTab={activeTab} onTabChange={handleTabChange} />
            )}
            {activeTab === "form" ? (
              <ContactForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                captchaValid={captchaValid}
                captchaKey={captchaKey}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCaptchaChange={setCaptchaValid}
                onCourseChange={handleCourseChange}
              />
            ) : activeTab === "manage" ? (
              <div>
                {coursesLoading ? (
                  <ContactFormSkeleton />
                ) : coursesError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300">
                      Error loading courses: {(coursesError as Error).message}
                    </p>
                  </div>
                ) : (
                  memoizedContactFormManager
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
} 