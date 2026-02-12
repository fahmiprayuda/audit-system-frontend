"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const menu = [
  {
    name: "Dokter Anak",
    price: "120K",
    image: "/images/service/dr-anak.jpg",
  },
  {
    name: "Dokter Gigi",
    price: "50K",
    image: "/images/service/dr-gigi.jpg",
  },
  {
    name: "Dokter Penyakit Dalam",
    price: "120K",
    image: "/images/service/dr-dalam.jpg",
  },
  {
    name: "Dokter Saraf",
    price: "150K",
    image: "/images/service/dr-saraf.jpg",
  },
];

// Animasi container (section)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animasi item (card)
const itemAnim = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function Menu() {
  return (
    <motion.section
      id="service"
      className="py-28 bg-white"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <motion.h2
          variants={itemAnim}
          className="text-3xl font-bold text-center mb-14"
        >
          Layanan Unggulan Kami
        </motion.h2>

        {/* SERVICES GRID */}
        <div
          className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    gap-10
    max-w-6xl
    mx-auto
    justify-items-center
  "
        >
          {menu.map((item, i) => (
            <motion.div
              key={i}
              variants={itemAnim}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="
        group relative
        w-full max-w-sm
        rounded-3xl
        bg-white
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        transition-all duration-500
      "
            >
              {/* GLOW */}
              <div
                className="
          absolute inset-0
          opacity-0
          group-hover:opacity-100
          transition duration-500
          bg-gradient-to-br
          from-blue-400/20
          via-cyan-400/10
          to-transparent
          blur-2xl
        "
              />

              {/* IMAGE */}
              <div className="relative h-20 overflow-hidden">
                <Image
                  src={item.image}
                  fill
                  sizes="315vw"
                  className="
            object-cover
            scale-100
            group-hover:scale-110
            transition duration-700
          "
                  alt={item.name}
                />
              </div>

              {/* CONTENT */}
              <div className="relative p-6 text-center">
                <h3
                  className="
            text-lg font-semibold
            mb-1
            transition
            group-hover:text-blue-600
          "
                >
                  {item.name}
                </h3>

                <p className="text-gray-600 text-sm">Rp {item.price}</p>

                {/* HOVER REVEAL */}
                <div
                  className="
            mt-3
            text-sm
            text-gray-500
            opacity-0
            translate-y-3
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all duration-500
          "
                >
                  Layanan profesional & terpercaya
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
