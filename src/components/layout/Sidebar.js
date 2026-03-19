"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  BarChart3,
} from "lucide-react";


export default function Sidebar() {

  const pathname = usePathname();

  const menu = [

    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },

    {
      name: "Monitoring Findings",
      path: "/findings",
      icon: FolderKanban,
    },
    
    {
      name: "Audit Projects",
      path: "/projects",
      icon: FolderKanban,
    },

    
    {
      name: "Departments",
      path: "/departments",
      icon: Building2,
    },

    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },

  ];

  return (

    <div className="w-64 bg-white border-r min-h-screen flex flex-col">

      {/* Logo */}

      <div className="p-6 border-b">

        <h1 className="font-bold text-lg">
          Audit System
        </h1>

        <p className="text-xs text-gray-400">
          Internal Audit
        </p>

      </div>

      {/* Menu */}

      <div className="flex flex-col p-4 gap-1">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = pathname.startsWith(item.path);

          return (

            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >

              <Icon size={18} />

              {item.name}

            </Link>

          );

        })}

      </div>

    </div>

  );

}