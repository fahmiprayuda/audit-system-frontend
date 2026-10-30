"use client";

import { usePathname } from "next/navigation";

import { Suspense } from "react";

import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import { ToastProvider } from "@/context/ToastContext";

export default function ClientLayout({
    children,
}) {

    const pathname =
        usePathname();

    const isLogin =
        pathname === "/login";

    return (
        <ToastProvider>
            {!isLogin && (
                <Suspense fallback={null}>
                    <Topbar />
                </Suspense>
            )}

            <div>
                {!isLogin && <Sidebar />}

                <main
                    className={
                        isLogin
                            ? ""
                            : "ml-0 md:ml-20 p-4 md:p-6 min-h-screen"
                    }
                >
                    <AuthGuard />
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}