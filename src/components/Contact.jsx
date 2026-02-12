"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-28 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Hubungi Kami
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kami siap membantu Anda dengan pelayanan terbaik. Jangan ragu untuk
            menghubungi kami.
          </p>
        </motion.div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Alamat
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Jl. RE. Martadinata No. 158
                  <br />
                  Baregbeg, Ciamis – Jawa Barat
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Telepon
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  (0265) 123456
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Email
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  info@rsalarif.co.id
                </p>
              </div>
            </div>
          </motion.div>

          {/* MAP */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="
    bg-white dark:bg-gray-800
    p-4 rounded-2xl shadow-lg
    overflow-hidden
  "
          >
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=RSU+Al-Arif+Ciamis&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
