"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-28 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        {/* ================= IMAGE ================= */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl"
        >
          <Image
            src="/images/about/rs-alarif.jpg" // ganti foto lo
            alt="Tentang Kami"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </motion.div>

        {/* ================= CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            Tentang Kami
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            RSU Al-Arif Ciamis adalah rumah sakit umum tipe D yang berlokasi di
            Jl. RE. Martadinata No. 158, Baregbeg, Ciamis. Kami berkomitmen
            memberikan pelayanan kesehatan terbaik dengan fasilitas modern dan
            tenaga medis profesional.
          </p>

          <p className="text-gray-600 leading-relaxed mb-8">
            Dengan layanan BPJS, USG 4D, Hemodialisa, serta dokter spesialis
            berpengalaman, kami hadir sebagai mitra kesehatan terpercaya bagi
            masyarakat Ciamis dan sekitarnya.
          </p>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-5 bg-white rounded-2xl shadow">
              <h3 className="text-2xl font-bold text-primary">20+</h3>
              <p className="text-sm text-gray-500 mt-1">Tahun Pengalaman</p>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow">
              <h3 className="text-2xl font-bold text-primary">50+</h3>
              <p className="text-sm text-gray-500 mt-1">Tenaga Medis</p>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow">
              <h3 className="text-2xl font-bold text-primary">24/7</h3>
              <p className="text-sm text-gray-500 mt-1">Layanan Darurat</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
