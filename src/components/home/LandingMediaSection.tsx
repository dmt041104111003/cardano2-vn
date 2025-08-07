"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
// import Modal from '~/components/admin/common/Modal';

interface MediaItem {
  url: string;
  type: string;
  title: string;
}

interface LandingMediaSectionProps {
  mediaItems: MediaItem[];
}

export default function LandingMediaSection({ mediaItems }: LandingMediaSectionProps) {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (mediaItem: MediaItem) => {
    setSelectedImage(mediaItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <section className="relative hidden lg:block">
        <div className="relative">
          <div className="relative h-[55vh] w-full">
            {mediaItems[0] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute left-12 top-0 z-10 h-48 w-56 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleImageClick(mediaItems[0])}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${mediaItems[0].url})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>
                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="mb-3 h-8 w-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                    <div className="h-1.5 w-1/2 bg-gray-200 dark:bg-white/10"></div>
                  </div>
                </div>
              </motion.div>
            )}
            {mediaItems[1] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 1 }}
                animate={{ opacity: 1, scale: 1, rotate: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="absolute right-8 top-8 z-20 h-64 w-64 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleImageClick(mediaItems[1])}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${mediaItems[1].url})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-800/40 to-transparent"></div>
                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="mb-3 h-12 w-full bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                    <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-white/10"></div>
                  </div>
                </div>
              </motion.div>
            )}
            {mediaItems[2] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: -1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="absolute bottom-24 left-4 z-30 h-60 w-72 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleImageClick(mediaItems[2])}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${mediaItems[2].url})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent"></div>
                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="mb-3 h-12 w-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-1/2 bg-gray-300 dark:bg-white/20"></div>
                    <div className="h-1.5 w-2/3 bg-gray-200 dark:bg-white/10"></div>
                  </div>
                </div>
              </motion.div>
            )}
            {mediaItems[3] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute bottom-12 right-12 z-40 h-52 w-52 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleImageClick(mediaItems[3])}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${mediaItems[3].url})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/40 to-transparent"></div>
                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="mb-3 h-10 w-full bg-gradient-to-r from-green-500/20 to-transparent"></div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-3/5 bg-gray-300 dark:bg-white/20"></div>
                    <div className="h-1.5 w-4/5 bg-gray-200 dark:bg-white/10"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
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
            onClick={handleCloseModal}
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
                                     <div className="mb-6">
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                       {selectedImage?.title && !selectedImage.title.toLowerCase().includes('verified') 
                         ? selectedImage.title 
                         : "Image Preview"}
                     </h2>
                   </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={selectedImage?.url}
                      alt={selectedImage?.title}
                      className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    />
                    {selectedImage?.title && !selectedImage.title.toLowerCase().includes('verified') && (
                      <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedImage.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
                         </motion.div>
             
             <motion.button
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3, duration: 0.3 }}
               onClick={handleCloseModal}
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
    </>
  );
}
