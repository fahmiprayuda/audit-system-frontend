"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ================= MENU CONFIG ================= */
const menu = [
  { name: "Home", id: "home", href: "/#home" },
  { name: "About", id: "about", href: "/#about" },
  { name: "Why Us", id: "trust", href: "/#trust" },
  { name: "Service", id: "service", href: "/#service" },
  { name: "Doctors", id: "doctors", href: "/#doctors" },
  { name: "Portfolio", id: "portfolio", href: "/#portfolio" },
  { name: "Contact", id: "contact", href: "/#contact" },
];

export default function NavbarTesla() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

  /* ================= SCROLL BG ================= */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= ACTIVE MENU (HOMEPAGE ONLY) ================= */
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 },
    );

    menu.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

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
          <Link
            href="/#home"
            className="text-lg font-semibold tracking-wide text-black dark:text-white"
          >
            RS Al-Arif Ciamis
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {menu.map((item) => {
              const isActive = pathname === "/" && active === item.id;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative pb-1 transition ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {item.name}

                  {/* ACTIVE LINE */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px]
                    bg-black dark:bg-white transition-all duration-300
                    ${isActive ? "w-full" : "w-0"}`}
                  />
                </Link>
              );
            })}
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

      {/* ================= MOBILE MENU ================= */}
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
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
