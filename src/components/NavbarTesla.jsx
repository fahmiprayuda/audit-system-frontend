"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarTesla() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const menu = [
    { name: "Home", id: "home" },
    { name: "Menu", id: "menu" },
    { name: "About", id: "about" },
    { name: "Gallery", id: "gallery" },
    { name: "Contact", id: "contact" },
  ];

  /* ================= SCROLL BG ================= */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= ACTIVE MENU ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    menu.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-500
          ${
            scrolled
              ? "bg-white/70 dark:bg-black/60 backdrop-blur-xl shadow-sm"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* LOGO */}
          <a
            href="#home"
            className="text-xl font-semibold tracking-wide text-black dark:text-white"
          >
            SMOKY
          </a>

          {/* ================= DESKTOP ================= */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {menu.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                className={`
                  relative pb-1 transition
                  ${
                    active === item.id
                      ? "text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  }
                `}
              >
                {item.name}

                {/* ACTIVE LINE */}
                <span
                  className={`
                    absolute left-0 -bottom-1 h-[2px]
                    bg-black dark:bg-white
                    transition-all duration-300
                    ${active === item.id ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </a>
            ))}
          </nav>

          {/* ================= HAMBURGER ================= */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden space-y-1.5"
          >
            <span className="block w-6 h-[2px] bg-black dark:bg-white" />
            <span className="block w-6 h-[2px] bg-black dark:bg-white" />
            <span className="block w-6 h-[2px] bg-black dark:bg-white" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="
                fixed top-0 right-0
                w-[75%] max-w-sm h-full
                bg-white dark:bg-black
                z-50
                p-8
              "
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setOpen(false)} className="text-2xl">
                  ✕
                </button>
              </div>

              <nav className="space-y-6 text-lg font-medium">
                {menu.map((item) => (
                  <a
                    key={item.name}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={`
                      block transition
                      ${
                        active === item.id
                          ? "text-black dark:text-white font-semibold"
                          : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                      }
                    `}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
