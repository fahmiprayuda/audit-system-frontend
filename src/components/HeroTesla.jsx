"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

/* ================= DATA ================= */

const slides = [
  {
    title: "Model X",
    desc: "0-100 km/jam dalam 2.6 detik",
    image: "/images/tesla1.jpg",
  },
  {
    title: "Model S",
    desc: "Jarak tempuh hingga 650km",
    image: "/images/tesla2.jpg",
  },
  {
    title: "Cybertruck",
    desc: "Built for any planet",
    image: "/images/tesla3.jpg",
  },
];

/* ================= SLIDE ================= */

function TeslaSlide({ slide, index, total, progress }) {
  const start = index / total;
  const end = (index + 1) / total;

  // ✅ Hook di top-level component (AMAN)
  const opacity = useTransform(
    progress,
    [start, start + 0.1, end - 0.1, end],
    [0, 1, 1, 0],
  );

  return (
    <motion.div id="home" style={{ opacity }} className="absolute inset-0">
      {/* BG */}
      <Image
        src={slide.image}
        fill
        className="object-cover"
        alt={slide.title}
        priority={index === 0}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-6">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold"
        >
          {slide.title}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-xl text-white/90"
        >
          {slide.desc}
        </motion.p>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition">
            Order Now
          </button>

          <button className="px-6 py-2 border border-white rounded-full hover:bg-white/10 transition">
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= MAIN ================= */

export default function HeroTesla() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className="relative h-[300vh]">
      {/* Sticky */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {slides.map((slide, i) => (
          <TeslaSlide
            key={i}
            slide={slide}
            index={i}
            total={slides.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
