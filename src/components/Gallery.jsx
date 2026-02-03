"use client";

import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Parallax } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/parallax";

import Image from "next/image";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { motion } from "framer-motion";

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // =========================
  // GANTI DATA DI SINI AJA
  // =========================
  const slides = [
    {
      type: "image",
      src: "/gallery/1.jpg",
      title: "Produk Unggulan",
    },
    {
      type: "video",
      src: "/videos/produksi.mp4",
      poster: "/gallery/thumb1.jpg",
      title: "Proses Produksi",
    },

    {
      type: "image",
      src: "/gallery/2.jpg",
      title: "Pabrik Produksi",
    },
    {
      type: "video",
      src: "/videos/bts.mp4",
      poster: "/gallery/thumb2.jpg",
      title: "Behind The Scene",
    },

    {
      type: "image",
      src: "/gallery/3.jpg",
      title: "Tim Profesional",
    },
  ];

  return (
    <section
      id="gallery"
      className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= TITLE ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Galeri Kami
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dokumentasi kegiatan, produk, dan proses produksi perusahaan kami.
          </p>
        </motion.div>

        {/* ================= SLIDER ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation, Parallax]}
            speed={900}
            parallax
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {slides.map((item, i) => (
              <SwiperSlide key={i}>
                <div
                  onClick={() => {
                    setIndex(i);
                    setOpen(true);
                  }}
                  className="
                    relative w-full h-[300px]
                    rounded-2xl overflow-hidden
                    shadow-xl cursor-pointer
                    group bg-black
                  "
                >
                  {/* IMAGE */}
                  {item.type === "image" && (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="
                        object-cover
                        group-hover:scale-110
                        transition duration-700
                      "
                    />
                  )}

                  {/* VIDEO */}
                  {item.type === "video" && (
                    <>
                      {/* Thumbnail */}
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40" />

                      {/* Play */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="
          w-16 h-16 rounded-full
          bg-white/90 text-black
          flex items-center justify-center
          text-2xl
          shadow-xl
          group-hover:scale-110
          transition
        "
                        >
                          ▶
                        </div>
                      </div>
                    </>
                  )}

                  {/* TITLE */}
                  <div
                    className="
                      absolute bottom-3 left-3 right-3
                      text-white text-sm font-medium
                      bg-black/40 backdrop-blur
                      px-3 py-1 rounded-lg
                    "
                  >
                    {item.title}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* ================= LIGHTBOX ================= */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={slides.map((item) => {
            if (item.type === "video") {
              return {
                type: "video",
                sources: [
                  {
                    src: item.src,
                    type: "video/mp4",
                  },
                ],
                autoPlay: true,
                controls: true,
              };
            }

            return {
              src: item.src,
            };
          })}
        />
      </div>
    </section>
  );
}
