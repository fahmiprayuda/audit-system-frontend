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
} from "lucide-react";

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
      department: ""
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
        res.data.department?.name || "-"
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
          <h1 className="font-bold text-slate-800 text-base">AuditFlow</h1>
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
                    className={`p-3.5 cursor-pointer transition ${
                      !notif.read_at
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

      {/* My Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">My Profile</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value
                    })
                  }
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Work Email</label>
                <input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value
                    })
                  }
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Role</label>
                <input
                  value={profile.role}
                  disabled
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm bg-slate-50 text-slate-500 capitalize"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                <input
                  value={profile.department}
                  disabled
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm bg-slate-50 text-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                disabled={!isChanged}
                onClick={saveProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassword && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl w-[500px] shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Change Password</h2>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    current_password: e.target.value
                  })
                }
                className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm"
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password: e.target.value
                  })
                }
                className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.new_password_confirmation}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password_confirmation: e.target.value
                  })
                }
                className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPassword(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={changePassword}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}