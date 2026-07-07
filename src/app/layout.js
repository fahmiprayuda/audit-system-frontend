"use client";

import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { usePathname } from "next/navigation";

import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function RootLayout({
  children,
}) {
  const pathname =
    usePathname();

  const isLogin =
    pathname === "/login";

  return (
    <html lang="en">
      <body className="bg-[#f8fafc]">
        {!isLogin && <Topbar />}

        <div>
          {!isLogin && <Sidebar />}

          <main
            className={
              isLogin
                ? ""
                : "ml-20 p-6 min-h-screen"
            }
          >
            <AuthGuard />
            {children}
            <AuthGuard />
          </main>
        </div>
      </body>
    </html>
  );
}