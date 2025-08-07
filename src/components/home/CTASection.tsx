"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
// import Action from "~/components/action";

interface Event {
  title: string;
  location: string;
  imageUrl: string;
}

export default function CTASection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-20 text-lg">Đang tải sự kiện...</div>;
  if (!events.length) return <div className="text-center py-20 text-lg">Không có sự kiện nào.</div>;

  return (
    <section id="CTA" className="w-full border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
        {/* HEADER */}
        <div className="mb-8 lg:mb-16">
          <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
            <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent" />
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">Events</h2>
          </div>
          <p className="max-w-3xl text-base lg:text-xl text-gray-700 dark:text-gray-300">
            Discover the highlights of our recent events and community activities.
          </p>
        </div>

        {/* GRID */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <EventCard event={events[0]} className="lg:w-[70%] h-80" />
            <EventCard event={events[1]} className="lg:w-[30%] h-80" />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col sm:flex-row gap-6 lg:w-[70%]">
              <EventCard event={events[2]} className="sm:w-1/2 h-80" />
              <EventCard event={events[3]} className="sm:w-1/2 h-80" />
            </div>

            <div className="flex flex-col gap-6 lg:w-[30%]">
              <EventCard event={events[4]} className="h-40" />
              <EventCard event={events[5]} className="h-40" />
            </div>
          </div>
        </div>

        <div className="relative mt-12 text-center">
          {/* <Action title="Next" href="#home" /> */}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, className }: { event: Event; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${className}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={event.imageUrl}
          alt={event.title}
          className="object-cover w-full h-full transition-all group-hover:brightness-90"
          fill
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
        <div className="absolute bottom-4 left-4 text-white z-10">
          <h4 className="text-lg font-semibold">{event.title}</h4>
          <p className="text-sm opacity-80">{event.location}</p>
        </div>
      </div>
    </motion.div>
  );
}
