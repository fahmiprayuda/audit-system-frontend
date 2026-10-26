"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const demoAccounts = [
    {
      roleName: "Audit Manager",
      tag: "Full Access",
      email: "manager@audit.com",
      password: "password",
      color: "from-blue-600 to-indigo-600",
      description: "Executive Dashboard, Company, User Management & Approvals",
    },
    {
      roleName: "Senior Auditor",
      tag: "Field Auditor",
      email: "auditor@audit.com",
      password: "password",
      color: "from-emerald-600 to-teal-600",
      description: "Create Projects, Findings, and Action Plan Verification",
    },
    {
      roleName: "Auditee / PIC",
      tag: "Department",
      email: "auditee@audit.com",
      password: "password",
      color: "from-amber-600 to-orange-600",
      description: "Task Queue, Evidence Upload & Extension Requests",
    },
  ];

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setSelectedRole(acc.roleName);
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      document.cookie = `token=${token}; path=/; SameSite=Lax`;
      document.cookie = `role=${user.role}; path=/; SameSite=Lax`;

      if (user.role === "auditee") {
        router.push("/my-tasks");
      } else {
        router.push("/dashboard/executive-dashboard");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your email and password.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient background glow elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AuditFlow
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Enterprise Internal Audit & Action Plan Management
          </p>
        </div>

        {/* Demo Credentials Quick-Select Pill Bar */}
        <div className="mb-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Quick Demo Access
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acc) => {
              const isSelected = selectedRole === acc.roleName;
              return (
                <button
                  key={acc.roleName}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                    isSelected
                      ? "bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500"
                      : "bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <span className="font-semibold">{acc.roleName}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {acc.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedRole && (
            <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1.5 px-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Prefilled for{" "}
                <strong className="text-slate-200">{selectedRole}</strong>
              </span>
            </p>
          )}
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/20">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Sign In</h2>
          <p className="text-slate-500 text-xs mb-6">
            Enter your credentials or choose a quick demo account above
          </p>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to AuditFlow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Portfolio Showcase • Powered by Next.js 16 & Laravel 12
        </p>
      </div>
    </div>
  );
}
