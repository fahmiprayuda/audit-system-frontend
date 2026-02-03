"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const menu = [
  {
    name: "Espresso",
    price: "20K",
    image: "/images/products/images1.jpeg",
  },
  {
    name: "Latte",
    price: "25K",
    image: "/images/products/images2.jpg",
  },
  {
    name: "Cappuccino",
    price: "23K",
    image: "/images/products/images3.jpg",
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
      id="menu"
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
          Menu Favorit
        </motion.h2>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {menu.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              variants={itemAnim}
              className="
                group bg-gray-50
                rounded-xl shadow
                hover:shadow-xl
                overflow-hidden
                transition
              "
            >
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  fill
                  sizes="33vw"
                  className="object-cover group-hover:scale-110 transition duration-700"
                  alt={item.name}
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg">{item.name}</h3>

                <p className="text-gray-600 mt-1">Rp {item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
