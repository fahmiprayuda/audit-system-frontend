"use client";

import { motion } from "framer-motion";
import { Award, Users, Factory, Globe } from "lucide-react";

export default function Trust() {
  const data = [
    {
      icon: <Factory size={36} />,
      title: "10+ Tahun Pengalaman",
      desc: "Berpengalaman dalam industri kopi dan manufaktur.",
    },
    {
      icon: <Users size={36} />,
      title: "5.000+ Pelanggan",
      desc: "Dipercaya oleh pelanggan dari berbagai daerah.",
    },
    {
      icon: <Award size={36} />,
      title: "Sertifikasi Resmi",
      desc: "Memiliki standar mutu dan legalitas lengkap.",
    },
    {
      icon: <Globe size={36} />,
      title: "Distribusi Nasional",
      desc: "Melayani pengiriman ke seluruh Indonesia.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Mengapa Memilih Kami?
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kami berkomitmen memberikan produk terbaik dengan standar kualitas
            tinggi dan pelayanan profesional.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: i * 0.5 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition"
            >
              {/* Icon */}
              <div
                className="
                  w-16 h-16 mx-auto mb-4 
                  flex items-center justify-center 
                  rounded-full 
                  bg-blue-100 dark:bg-blue-900/30 
                  text-blue-600 dark:text-blue-400
                  group-hover:scale-110 transition
                "
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>

              {/* Desc */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
