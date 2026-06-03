"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

export default function Topbar() {
  const router = useRouter();

  const [mounted, setMounted] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef(null);

  useEffect(() => {
    setMounted(true);

    const stored =
      localStorage.getItem("user");

    if (stored) {
      setUser(
        JSON.parse(stored)
      );
    }
  }, []);

  useEffect(() => {
    const handleClickOutside =
      (e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            e.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie =
      "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };

  return (
    <header className="ml-20 h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="font-semibold text-lg">
        Audit Monitoring
      </h1>

      <div
        className="relative"
        ref={dropdownRef}
      >
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div
            className="w-9 h-9 rounded-full
                       bg-blue-600 text-white
                       flex items-center justify-center
                       font-semibold"
          >
            {mounted
              ? user?.name?.charAt(0)
              : ""}
          </div>

          <div className="text-left">
            <p className="text-sm font-medium">
              {mounted
                ? user?.name ||
                "User"
                : ""}
            </p>

            <p className="text-xs text-gray-500">
              {mounted
                ? user?.email
                : ""}
            </p>
          </div>

          <ChevronDown
            size={16}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-48
                       bg-white border rounded-lg shadow-lg z-50"
          >
            <button
              className="w-full flex items-center gap-2
                         px-4 py-3 text-sm hover:bg-gray-50"
            >
              <User size={16} />
              Profile
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2
                         px-4 py-3 text-sm
                         text-red-600 hover:bg-red-50"
            >
              <LogOut
                size={16}
              />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}