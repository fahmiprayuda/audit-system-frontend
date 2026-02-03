"use client";

import { useEffect, useState } from "react";

const menus = [
  { name: "Home", id: "home" },
  { name: "Trust", id: "trust" },
  { name: "About", id: "about" },
  { name: "Menu", id: "menu" },
  { name: "Gallery", id: "gallery" },
  { name: "Contact", id: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

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
        threshold: 0.6, // 60% section keliatan = aktif
      },
    );

    menus.forEach((menu) => {
      const el = document.getElementById(menu.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="text-white font-bold text-xl">Smoky</div>

        {/* MENU */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {menus.map((menu) => (
            <li key={menu.id}>
              <a
                href={`#${menu.id}`}
                className={`
                  relative pb-1 transition
                  ${
                    active === menu.id
                      ? "text-yellow-400"
                      : "text-white/80 hover:text-white"
                  }
                `}
              >
                {menu.name}

                {/* UNDERLINE */}
                {active === menu.id && (
                  <span
                    className="
                      absolute left-0 bottom-0
                      w-full h-[2px]
                      bg-yellow-400
                      rounded-full
                      animate-pulse
                    "
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
