"use client";

import api from "@/lib/axios";

import { timeAgo } from "@/utils/date";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ChevronDown,
  LogOut,
  User,
  Bell,
  KeyRound,
  Shield,
  CheckCheck,
  Menu,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";

import {
  usePathname,
  useSearchParams
} from "next/navigation";

export default function Topbar() {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl =
    pathname +
    (
      searchParams.toString()
        ? `?${searchParams}`
        : ""
    );

  const [showProfile, setShowProfile] = useState(false);

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      role: "",
      department: "",
      company: "",
    });

  const [showPassword, setShowPassword] = useState(false);

  const loadProfile = async () => {
    const res =
      await api.get("/profile");

    setProfile({
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      department:
        res.data.department?.name || "-",
      company:
        res.data.department?.company?.name || "-"
    });
  };

  const saveProfile = async () => {
    await api.put("/profile", {
      name: profile.name,
      email: profile.email
    });
    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email
    };
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    alert("Profile updated");
    setShowProfile(false);
  };

  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const loadNotifications = async () => {
    const res = await api.get(
      "/notifications"
    );
    setNotifications(
      res.data
    );
  };

  const loadUnread = async () => {
    const res = await api.get(
      "/notifications/unread-count"
    );
    setCount(res.data.count);
  };

  useEffect(() => {
    loadUnread();
    loadNotifications();
  }, []);

  const readAll = async () => {
    try {
      await api.post(
        "/notifications/read-all"
      );
      loadNotifications();
      loadUnread();
    } catch (err) {
      console.error(err);
    }
  };

  const openNotification = async (notif) => {
    await api.post(
      `/notifications/${notif.id}/read`
    );
    loadUnread();
    setNotifOpen(false);
    if (currentUrl === notif.url) {
      window.dispatchEvent(
        new Event("refresh-finding")
      );
      return;
    }
    router.push(notif.url);
  };

  useEffect(() => {
    loadUnread();
    const interval =
      setInterval(() => {
        loadUnread();
        loadNotifications();
      }, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  const isChanged =
    profile.name !== (user?.name || "") ||
    profile.email !== (user?.email || "");

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const stored =
      localStorage.getItem("user");

    if (stored) {
      setUser(
        JSON.parse(stored)
      );
    }
  }, []);

  useEffect(() => {
    const handleClickOutside =
      (e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            e.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      // Ignore network error on logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
    }
  };

  const [passwordForm, setPasswordForm] =
    useState({
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
    });

  const changePassword = async () => {
    try {
      await api.post(
        "/change-password",
        passwordForm
      );
      alert(
        "Password changed successfully"
      );
      setShowPassword(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to change password"
      );
    }
  };


  return (
    <>
      <header className="ml-0 md:ml-20 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 transition-all">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("toggle-mobile-sidebar"))}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Shield size={16} />
            </div>
            <h1 className="font-bold text-slate-800 text-base">Internal Audit System</h1>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          {/* Notifications Button */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {mounted ? (user?.name?.charAt(0) || "U") : "U"}
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {mounted ? (user?.name || "User") : ""}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {mounted ? (user?.role || "") : ""}
                </p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                <div className="py-1">
                  <button
                    onClick={async () => {
                      await loadProfile();
                      setShowProfile(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    <User size={14} className="text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPassword(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    <KeyRound size={14} className="text-slate-500" />
                    <span>Change Password</span>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
                  {count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {count}
                    </span>
                  )}
                </div>
                {count > 0 && (
                  <button
                    onClick={readAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => openNotification(notif)}
                      className={`p-3.5 cursor-pointer transition ${!notif.read_at
                        ? "bg-blue-50/60 hover:bg-blue-50"
                        : "bg-white hover:bg-slate-50"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-xs text-slate-900">{notif.title}</p>
                        {!notif.read_at && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </header>

      {/* My Profile Modal (Rendered via Portal to document.body to avoid stacking context & backdrop-filter issues) */}
      {mounted && typeof document !== "undefined" && showProfile && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">My Profile</h2>
                  <p className="text-xs text-slate-500">Manage your account information and preferences</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value
                    })
                  }
                  placeholder="Enter full name"
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value
                    })
                  }
                  placeholder="Enter work email"
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role</label>
                  <input
                    value={profile.role || "-"}
                    disabled
                    className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm bg-slate-50 text-slate-500 capitalize cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company</label>
                  <input
                    value={profile.company || "-"}
                    disabled
                    className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
                  <input
                    value={profile.department || "-"}
                    disabled
                    className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!isChanged}
                onClick={saveProfile}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm shadow-blue-500/20 cursor-pointer disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Change Password Modal (Rendered via Portal to document.body) */}
      {mounted && typeof document !== "undefined" && showPassword && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                  <p className="text-xs text-slate-500">Ensure your account stays secure with a strong password</p>
                </div>
              </div>
              <button
                onClick={() => setShowPassword(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current_password: e.target.value
                    })
                  }
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      new_password: e.target.value
                    })
                  }
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      new_password_confirmation: e.target.value
                    })
                  }
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPassword(false)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={changePassword}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}