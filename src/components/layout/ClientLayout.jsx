"use client";

import { usePathname } from "next/navigation";

import { Suspense } from "react";

import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ClientLayout({
    children,
}) {

    const pathname =
        usePathname();

    const isLogin =
        pathname === "/login";

    return (
        <>
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
                            : "ml-20 p-6 min-h-screen"
                    }
                >
                    <AuthGuard />
                    {children}
                </main>
            </div>
        </>
    );
}