"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);

  // Detect scroll position on hero
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Animations
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section id="home" ref={ref} className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src="/images/hero/rs.jpg" // GANTI GAMBAR LO
          fill
          priority
          className="object-cover"
          alt="Hero"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="
          relative z-10
          h-full
          flex flex-col
          items-center
          justify-center
          text-center
          text-white
          px-6
        "
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Rumah Sakit Umum
        </h1>

        <p className="max-w-xl text-lg md:text-xl text-white/90">
          Rumah Sakit Umum Penyedia Layanan Kesehatan Terpercaya dengan
          Pelayanan Prima dan Fasilitas Modern untuk Kesejahteraan Anda.
        </p>

        <a
          href="#service"
          className="
            mt-8 px-8 py-3
            bg-blue-600 text-white
            rounded-full
            font-semibold
            hover:bg-gray-200 hover:text-blue-600
            transition
          "
        >
          Lihat Layanan Kami
        </a>
      </motion.div>
    </section>
  );
}
