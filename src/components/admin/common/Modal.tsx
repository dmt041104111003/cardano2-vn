import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ModalProps } from "~/constants/admin";

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="button"
                  title="Close"
                  tabIndex={0}
                  aria-label="Close modal"
                  style={{
                    position: 'relative',
                    width: '2.5em',
                    height: '2.5em',
                    border: '2px solid #dc2626',
                    background: 'rgba(220,38,38,0.08)',
                    borderRadius: '5px',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                >
                  <span 
                    className="X"
                    style={{
                      content: "",
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '1.5em',
                      height: '2px',
                      backgroundColor: '#dc2626',
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
                      width: '1.5em',
                      height: '2px',
                      backgroundColor: '#dc2626',
                      transform: 'translateX(-50%) rotate(-45deg)'
                    }}
                  ></span>
                  <div 
                    className="close"
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      padding: '0.6rem 1.2rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translateX(-50%)',
                      top: '-60%',
                      left: '50%',
                      width: '2.5em',
                      height: '1.5em',
                      fontSize: '10px',
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
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] transparent-scrollbar">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 