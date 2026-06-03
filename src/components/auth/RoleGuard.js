"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getUser } from "@/lib/auth";

export default function RoleGuard({
    roles,
    children,
}) {

    const router = useRouter();

    useEffect(() => {

        const user = getUser();

        if (!user) return;

        if (!roles.includes(user.role)) {

            if (user.role === "auditee") {
                router.replace("/my-tasks");
            } else {
                router.replace("/projects");
            }
        }

    }, [roles, router]);

    const user = getUser();

    if (!user) return null;

    if (!roles.includes(user.role)) {
        return null;
    }

    return children;
}