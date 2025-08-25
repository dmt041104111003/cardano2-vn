"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WelcomeModalData } from "~/constants/admin";
import { useToastContext } from "~/components/toast-provider";
import WelcomeModalTabs from "./WelcomeModalTabs";
import WelcomeModalContent from "./WelcomeModalContent";
import WelcomeModalEdit from "./WelcomeModalEdit";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin?: { x: string; y: string };
}

export default function WelcomeModal({ isOpen, onClose, origin }: WelcomeModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"welcome" | "edit">("welcome");
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState<WelcomeModalData>({
    title: "",
    description: "",
    imageUrl: "",
    buttonLink: "",
    startDate: "",
    endDate: "",
    publishStatus: "DRAFT",
    isActive: true
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

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
          setIsAdmin(data?.data?.role?.name === 'ADMIN');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session]);

  const { data: welcomeData } = useQuery({
    queryKey: ['welcome-modal'],
    queryFn: async () => {
      const response = await fetch('/api/welcome-modal');
      if (!response.ok) {
        return null;
      }
      return response.json();
    }
  });

  useEffect(() => {
    if (welcomeData?.data) {
      const data = welcomeData.data;
      setFormData({
        title: data.title || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        buttonLink: data.buttonLink || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        publishStatus: data.publishStatus || "DRAFT",
        isActive: data.isActive || true
      });
      setPreviewImage(data.imageUrl || "");
    }
  }, [welcomeData]);

  const saveMutation = useMutation({
    mutationFn: async (data: WelcomeModalData) => {
      const response = await fetch('/api/admin/welcome-modal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save welcome modal');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-modal'] });
      showSuccess('Welcome modal updated successfully');
    },
    onError: (error: Error) => {
      console.error('Welcome modal save error:', error);
      showError('Failed to update welcome modal', error.message);
    },
  });

  const handleTabChange = (tab: "welcome" | "edit") => {
    setActiveTab(tab);
  };

  const handleInputChange = (field: keyof WelcomeModalData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.title.trim()) {
      showError('Title is required');
      return;
    }
    
    if (!formData.description || !formData.description.trim()) {
      showError('Description is required');
      return;
    }
    
    saveMutation.mutate(formData);
  };

  const handleImageChange = (media: any) => {
    handleInputChange('imageUrl', media.url);
    setPreviewImage(media.url);
    showSuccess('Image updated successfully');
  };

  const handleButtonClick = () => {
    if (formData.buttonLink) {
      window.open(formData.buttonLink, '_blank');
    }
    onClose();
  };

  const shouldDisplayModal = () => {
    if (isAdmin) return true;

    if (!welcomeData?.data) return false;
    
    const data = welcomeData.data;
    const now = new Date();
    const startDate = data.startDate ? new Date(data.startDate) : null;
    const endDate = data.endDate ? new Date(data.endDate) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && shouldDisplayModal() && (
        <motion.div
          initial={{
              opacity: 0,
              scaleX: 0,
              filter: "blur(12px)",
              transformOrigin: "right",
          }}
          animate={{
              opacity: 1,
              scaleX: 1,
              filter: "blur(0px)",
              transformOrigin: "right",
          }}
          exit={{
              opacity: 0,
              scaleX: 0,
              filter: "blur(12px)",
              transformOrigin: "right",
          }}
          transition={{
              duration: 0.6,
              ease: [0.25, 1, 0.5, 1],
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto transparent-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-[40px] shadow-2xl">
                <div className="p-8">
                  <WelcomeModalTabs 
                    isAdmin={isAdmin}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                  />

                  {activeTab === "welcome" && (
                    <WelcomeModalContent 
                      welcomeData={welcomeData}
                      onButtonClick={handleButtonClick}
                    />
                  )}

                  {activeTab === "edit" && (
                    <WelcomeModalEdit 
                      formData={formData}
                      previewImage={previewImage}
                      onInputChange={handleInputChange}
                      onImageChange={handleImageChange}
                      onSave={handleSave}
                      isSaving={saveMutation.isPending}
                    />
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              onClick={onClose}
              className="absolute button"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '4em',
                height: '4em',
                border: 'none',
                background: 'rgba(180, 83, 107, 0.11)',
                borderRadius: '5px',
                transition: 'background 0.5s',
                zIndex: 50
              }}
            >
              <span 
                className="X"
                style={{
                  content: "",
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2em',
                  height: '1.5px',
                  backgroundColor: 'rgb(255, 255, 255)',
                  transform: 'translateX(-50%) rotate(45deg)'
                }}
              ></span>
              <span 
                className="Y"
                style={{
                  content: "",
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2em',
                  height: '1.5px',
                  backgroundColor: '#fff',
                  transform: 'translateX(-50%) rotate(-45deg)'
                }}
              ></span>
              <div 
                className="close"
                style={{
                  position: 'absolute',
                  display: 'flex',
                  padding: '0.8rem 1.5rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateX(-50%)',
                  top: '-70%',
                  left: '50%',
                  width: '3em',
                  height: '1.7em',
                  fontSize: '12px',
                  backgroundColor: 'rgb(19, 22, 24)',
                  color: 'rgb(187, 229, 236)',
                  border: 'none',
                  borderRadius: '3px',
                  pointerEvents: 'none',
                  opacity: '0'
                }}
              >
                Close
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
