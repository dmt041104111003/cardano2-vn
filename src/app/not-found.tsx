"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { routers } from "~/constants/routers";
import { images } from "~/public/images";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-3 bg-[#13161b]"
    >
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Image src={images.logo} alt="Logo Not Found" width={260} className="animate-pulse" priority />
      </motion.div>

      <motion.h1 className="text-2xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        404 - Page Not Found
      </motion.h1>

      <motion.p className="text-sm text-[#8e97a8] text-center max-w-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Sorry, the page you are looking for does not exist.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Link
          href={routers.home}
          className="mt-4 inline-flex items-center gap-2 rounded border border-white/30 bg-gray-800/50 px-4 py-2 text-sm font-medium text-white shadow transition hover:border-white/50 hover:bg-gray-700/50"
        >
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
