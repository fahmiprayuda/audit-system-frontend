"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroNike() {
  return (
    <section
      id="home"
      className="
        relative h-screen w-full
        bg-black overflow-hidden
        flex items-center
      "
    >
      {/* ================= BACKGROUND TEXT ================= */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.5 }}
        className="
          absolute inset-0
          flex items-center justify-center
          text-[18vw] font-black
          text-white uppercase
          tracking-tight
          pointer-events-none
        "
      >
        JUST
      </motion.h1>

      {/* ================= IMAGE ================= */}
      <motion.div
        initial={{ x: 120, opacity: 0, scale: 1.1 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="
          absolute right-0 top-0
          h-full w-1/2
          hidden md:block
        "
      >
        <Image
          src="/images/nike.jpg" // ganti foto lo
          fill
          priority
          className="object-cover"
          alt="Nike Hero"
        />
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="max-w-xl"
        >
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-4">
            Performance Series
          </p>

          <h2
            className="
              text-5xl md:text-7xl font-extrabold
              text-white leading-tight
              mb-6
            "
          >
            MOVE
            <br />
            WITHOUT
            <br />
            LIMITS
          </h2>

          <p className="text-gray-300 mb-8 leading-relaxed">
            Designed for champions. Built for those who never stop pushing
            forward.
          </p>

          {/* ================= BUTTON ================= */}
          <div className="flex gap-4">
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              href="#menu"
              className="
                bg-white text-black
                px-8 py-3 font-semibold
                rounded-full
              "
            >
              Shop Now
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#gallery"
              className="
                border border-white/30
                text-white
                px-8 py-3 rounded-full
              "
            >
              Explore
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
