"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";

const logos = Array(8).fill("/images/common/loading.png");

export default function PartnerLogosCarousel() {
  return (
    <div className="w-full py-10 bg-white dark:bg-gray-900">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl text-center mb-6">Our Partners</h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={2}
        spaceBetween={30}
        loop
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        // pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="!pb-10"
      >
        {logos.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex items-center justify-center h-24">
              <img
                src={src}
                alt={`Logo ${idx + 1}`}
                className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition"
                style={{ maxWidth: 120 }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 