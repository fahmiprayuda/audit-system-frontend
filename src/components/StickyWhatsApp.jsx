"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function StickyWhatsApp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const phoneNumber = "6282213232456"; // ganti ke nomor lo
  const message =
    "Halo RS Al-Arif, saya ingin bertanya mengenai layanan kesehatan.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        bg-green-500 hover:bg-green-600
        text-white
        px-4 py-3
        rounded-full
        shadow-lg
        hover:shadow-xl
        transition
      "
    >
      <MessageCircle className="w-5 h-5" />
      <span className="absolute inset-0 rounded-full bg-green-400 opacity-60 animate-ping">
        Chat Kami
      </span>
    </motion.a>
  );
}
