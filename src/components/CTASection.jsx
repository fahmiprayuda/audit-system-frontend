"use client";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-blue-600 to-cyan-500 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto px-6 text-center"
      >
        <h3 className="text-3xl md:text-4xl font-bold">
          Butuh Layanan Kesehatan Terpercaya?
        </h3>
        <p className="mt-4 text-white/90 max-w-2xl mx-auto">
          Tim medis profesional, fasilitas modern, dan pelayanan 24/7.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition"
          >
            Hubungi Kami
          </a>
          <a
            href="#service"
            className="px-8 py-3 rounded-full border border-white/60 hover:bg-white/10 transition"
          >
            Lihat Layanan
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export function FooterApple() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-white font-semibold tracking-wide">RS Al-Arif</h2>

          <nav className="flex gap-6 text-sm">
            <a href="#about" className="hover:text-white">
              About
            </a>
            <a href="#service" className="hover:text-white">
              Services
            </a>
            <a href="#portfolio" className="hover:text-white">
              Portfolio
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} RS Al-Arif. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
