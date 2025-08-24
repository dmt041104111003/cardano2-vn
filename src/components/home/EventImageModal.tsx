"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Event, EventImageModalProps } from "~/constants/events";

export default function EventImageModal({ event, isOpen, onClose }: EventImageModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    {event.location}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg" 
                  />
                </div>
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
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "4em",
              height: "4em",
              border: "none",
              background: "rgba(180, 83, 107, 0.11)",
              borderRadius: "5px",
              transition: "background 0.5s",
              zIndex: 50,
            }}
          >
            <span
              className="X"
              style={{
                content: "",
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "2em",
                height: "1.5px",
                backgroundColor: "rgb(255, 255, 255)",
                transform: "translateX(-50%) rotate(45deg)",
              }}
            ></span>
            <span
              className="Y"
              style={{
                content: "",
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "2em",
                height: "1.5px",
                backgroundColor: "#fff",
                transform: "translateX(-50%) rotate(-45deg)",
              }}
            ></span>
            <div
              className="close"
              style={{
                position: "absolute",
                display: "flex",
                padding: "0.8rem 1.5rem",
                alignItems: "center",
                justifyContent: "center",
                transform: "translateX(-50%)",
                top: "-70%",
                left: "50%",
                width: "3em",
                height: "1.7em",
                fontSize: "12px",
                backgroundColor: "rgb(19, 22, 24)",
                color: "rgb(187, 229, 236)",
                border: "none",
                borderRadius: "3px",
                pointerEvents: "none",
                opacity: "0",
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
