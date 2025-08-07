import { motion, AnimatePresence } from "framer-motion";
import { MemberModalProps } from '~/constants/members';

export default function MemberModal({ member, isOpen, onClose }: MemberModalProps) {
  if (!member) return null;

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
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="flex h-96">
                <div className="w-2/5 relative overflow-hidden">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
  
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-0.5 bg-gray-400/60 dark:bg-white/60 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-gray-200/90 dark:text-white/90 text-xs font-medium">Cardano2VN</div>
                  </div>
                </div>
                <div className="w-3/5 flex flex-col overflow-hidden">
                  <div className="p-8 overflow-y-auto flex-1 transparent-scrollbar">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div>
                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                        >
                          {member.name}
                        </motion.h2>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                        >
                          {member.role}
                        </motion.div>
                      </div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="text-gray-600 dark:text-gray-300 leading-relaxed text-base"
                      >
                        {member.description}
                      </motion.p>
                      {member.skills && member.skills.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.4 }}
                          className="space-y-3"
                        >
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill: string, index: number) => (
                              <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="space-y-2"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact</h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-1.5 h-1.5 bg-gray-400/60 dark:bg-white/60 rounded-full"></div>
                            <span>{member.email || "cardano2vn@gmail.com"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="w-1.5 h-1.5 bg-gray-400/60 dark:bg-white/60 rounded-full"></div>
                            <span>LinkedIn</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
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