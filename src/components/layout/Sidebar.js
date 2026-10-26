"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState, useEffect, useSyncExternalStore, useMemo } from "react";
import { getUser } from "@/utils/auth";

import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Axe,
  BarChart3,
  CircleGauge,
  UserLock,
  Building2,
  FolderClock,
  X,
} from "lucide-react";

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = () => {
  try {
    return localStorage.getItem("user");
  } catch {
    return null;
  }
};

const getServerSnapshot = () => null;

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
    };
  }, []);

  const userJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = useMemo(() => {
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }, [userJson]);

  const menu = [
    {
      name: "Executive Dashboard",
      path: "/dashboard/executive-dashboard",
      icon: LayoutDashboard,
      roles: ["manager", "auditor"],
    },
    {
      name: "Action Plan Monitoring",
      path: "/dashboard/action-plan-monitoring",
      icon: CircleGauge,
      roles: ["manager", "auditor"],
    },
    {
      name: "Audit Projects",
      path: "/projects",
      icon: FolderKanban,
      roles: ["manager", "auditor"],
    },
    {
      name: "Monitoring Findings",
      path: "/findings",
      icon: ClipboardList,
      roles: ["manager", "auditor"],
    },
    {
      name: "My Tasks",
      path: "/my-tasks",
      icon: BarChart3,
      roles: ["auditee"],
    },
    {
      name: "User Management",
      path: "/users",
      icon: UserLock,
      roles: ["manager"],
    },
    {
      name: "Company Management",
      path: "/companies",
      icon: Building2,
      roles: ["manager"],
    },
    {
      name: "Audit Trails",
      path: "/audit-trails",
      icon: FolderClock,
      roles: ["manager", "auditor"],
    },
  ];

  if (!user) {
    return null;
  }

  const filteredMenu = menu.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (itemPath) => {
    const isFindingDetail = pathname.startsWith("/findings/");

    if (itemPath === "/projects") {
      return pathname.startsWith("/projects") || isFindingDetail;
    }

    if (itemPath === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(itemPath);
  };

  return (
    <>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl p-6 z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <h1 className="text-lg font-bold text-slate-900">AuditFlow</h1>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-1.5 overflow-y-auto flex-1">
              {filteredMenu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden md:block
          group fixed left-0 top-0 h-screen
          w-20 hover:w-72
          bg-white/5
          backdrop-blur-xl
          border-r border-white/20
          text-slate-800
          transition-all duration-500 ease-out
          z-50 overflow-hidden
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        "
      >
        {/* HEADER */}
        <div className="h-20 flex items-center px-6 border-b border-white/20">
          <h1 className="text-xl font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 text-slate-900">
            AuditFlow
          </h1>
        </div>

        {/* MENU */}
        <div className="p-4 space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  relative flex items-center gap-4 px-4 py-3 rounded-2xl
                  transition-all duration-300
                  ${active
                    ? "bg-white/60 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
                  }
                `}
              >
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full" />
                )}

                <Icon size={20} className="shrink-0" />

                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/30">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name}
            </p>

            <p className="text-xs text-slate-600">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}