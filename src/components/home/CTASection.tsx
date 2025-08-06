"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { images } from "~/public/images";
import Action from "~/components/action";
const events = [
  {
    title: "Cardano Coffee Lounge",
    location: "Hanoi",
    imageUrl: images.landing01,
  },
  {
    title: "Khoá Học Web3 cho Sinh Viên",
    location: "Đại Học Giao Thông Vận Tải",
    imageUrl: images.landing01,
  },
  {
    title: "Cardano Summit 2022",
    location: "Hà Nội",
    imageUrl: images.landing01,
  },
  {
    title: "Workshop Blockchain",
    location: "TP. HCM",
    imageUrl: images.landing01,
  },
  {
    title: "Cardano Summit 2022",
    location: "Hà Nội",
    imageUrl: images.landing01,
  },
  {
    title: "Workshop Blockchain",
    location: "TP. HCM",
    imageUrl: images.landing01,
  },
];

export default function CTASection() {
  return (
    <section id="CTA" className="w-full border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
        {/* SECTION HEADER */}
        <div className="mb-8 lg:mb-16">
          <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
            <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent" />
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">Events</h2>
          </div>
          <p className="max-w-3xl text-base lg:text-xl text-gray-700 dark:text-gray-300">
            Discover the highlights of our recent events and community activities.
          </p>
        </div>

        {/* EVENT CARDS - Masonry layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer group"
            >
              <div className="relative w-full h-72">
                <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:brightness-90 transition-all" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-semibold leading-tight">{event.title}</h4>
                  <p className="text-sm opacity-80">{event.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Action title="Join Us" href="#join" />
    </section>
  );
}
