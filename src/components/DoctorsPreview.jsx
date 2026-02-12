"use client";

import DoctorCard from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";
import Link from "next/link";
import { motion, scale } from "framer-motion";

/* ===== VARIANTS ===== */

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    x: 80,
    filter: "blur(8px)",
    scale: 0.95,
  },
  show: {
    scale: 1,
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export default function DoctorsPreview() {
  return (
    <section id="doctors" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold">Dokter Kami</h2>
          <p className="text-gray-600 mt-3">
            Tim dokter profesional dan berpengalaman
          </p>
        </motion.div>

        {/* PREVIEW GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid
  gap-8
  grid-cols-[repeat(auto-fit,minmax(100px,150px))]
  justify-center"
        >
          {doctors.slice(0, 6).map((doctor) => (
            <motion.div key={doctor.slug} variants={item}>
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/doctors"
            className="
              inline-block
              px-8 py-3
              rounded-full
              bg-blue-600 text-white
              font-semibold
              hover:bg-gray-200 hover:text-blue-600
              transition
            "
          >
            Lihat Semua Dokter
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
