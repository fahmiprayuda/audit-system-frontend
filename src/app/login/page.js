"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await api.post("/login", {
                email,
                password,
            });

            const token = res.data.token;

            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            document.cookie = `token=${token}; path=/`;
            document.cookie =
                `role=${res.data.user.role}; path=/`;

            if (res.data.user.role === "auditee") {
                router.push("/my-tasks");
            } else {
                router.push("/projects");
            }

        } catch (err) {
            console.error(err);
            alert("Login gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Audit System Login
                </h2>

                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                    <input
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}