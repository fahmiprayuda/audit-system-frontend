"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function Sidebar() {

  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

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
    // {
    //   name: "Departments",
    //   path: "/departments",
    //   icon: Building2,
    //   roles: ["manager", "auditor"],
    // },
    // {
    //   name: "Reports",
    //   path: "/reports",
    //   icon: BarChart3,
    //   roles: ["manager", "auditor"],
    // },
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
      roles: ["manager"],
    },
  ];

  useEffect(() => {

    setUser(getUser());

    setMounted(true);

  }, []);

  if (!mounted) {
    return null;
  }

  const filteredMenu = menu.filter(item =>
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
    <aside
      className="
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
  );
}