import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LoginFooter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-8 md:mt-12 text-center"
    >
      <div className="flex items-center justify-center relative z-10">
        <div className="flex-1 border-t-4 border-gray-600 h-0 shadow-sm"></div>
        <span className="px-6 text-gray-700 bg-transparent text-base font-medium">
          Web2 Login Powered by{" "}
          <span className="inline-flex items-center gap-2 text-[#003C8C] font-semibold">
            CARDANO2VN
          </span>
        </span>
        <div className="flex-1 border-t-4 border-gray-600 h-0 shadow-sm"></div>
      </div>
        
      <div className="flex items-center justify-center gap-6 mb-6 mt-6">
        <button 
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
          title="Login with Google"
        >
          <Image
            src="/images/wallets/google.png"
            alt="Google"
            width={48}
            height={48}
            className="w-12 h-12"
            loading="lazy"
          />
        </button>
        <button 
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
          title="Login with Telegram"
        >
          <Image
            src="/images/wallets/telegram.png"
            alt="Telegram"
            width={48}
            height={48}
            className="w-12 h-12"
            loading="lazy"
          />
        </button>
      </div>
        
      <div className="space-y-3">
        <Link href="/help" className="text-gray-900 underline text-sm hover:text-red-500 transition-colors">
          Help Center
        </Link>
        <p className="text-gray-500 text-xs">
          @Cardano2vn Network Foundation LTD.
        </p>
      </div>
    </motion.div>
  );
} 