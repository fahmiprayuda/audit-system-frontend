"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("submit login");

        try {
            const res = await api.post("/login", {
                email,
                password,
            });

            console.log("SUCCESS", res.data);

            localStorage.setItem("token", res.data.token);

            router.push("/projects");

        } catch (err) {
            console.log("ERR FULL:", err);
            console.log("ERR RESPONSE:", err.response);
            console.log("ERR REQUEST:", err.request);
            console.log("ERR MESSAGE:", err.message);

            alert("Login gagal");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    className="form-control mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
}