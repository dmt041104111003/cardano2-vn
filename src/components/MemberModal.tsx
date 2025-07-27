import { motion, AnimatePresence } from "framer-motion";

interface MemberType {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  color?: string;
  skills?: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MemberModalProps {
  member: MemberType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberModal({ member, isOpen, onClose }: MemberModalProps) {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
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
                    <div className="w-8 h-0.5 bg-white/60 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white/80 text-xs font-medium">Cardano2VN</div>
                  </div>
                </div>
                <div className="w-3/5 p-8 flex flex-col justify-center">
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
                        className="text-3xl font-bold text-white mb-3"
                      >
                        {member.name}
                      </motion.h2>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20"
                      >
                        {member.role}
                      </motion.div>
                    </div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="text-gray-300 leading-relaxed text-base"
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
                        <h3 className="text-sm font-semibold text-white">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill: string, index: number) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                              className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/20"
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
                      <h3 className="text-sm font-semibold text-white">Contact</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                          <span>{member.email || "cardano2vn@gmail.com"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                          <span>LinkedIn</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              onClick={onClose}
              className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900/90 hover:bg-gray-800/90 border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 