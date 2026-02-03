"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Smoky Coffee Indonesia menyediakan kopi premium...
        </p>
      </div>
    </motion.section>
  );
}
