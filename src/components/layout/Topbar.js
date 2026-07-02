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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
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
    <header className="ml-20 h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="font-semibold text-lg">Audit Monitoring</h1>

      <div className="relative flex items-center gap-4 mr-16">
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            <div
              className="w-9 h-9 rounded-full sbg-blue-600 text-white flex items-center justify-center font-semibold">
              {mounted ? user?.name?.charAt(0) : ""} </div>

            <div className="text-left">
              <p className="text-sm font-medium">{mounted ? user?.name || "User" : ""}</p>
              <p className="text-xs text-gray-500">{mounted ? user?.email : ""}</p>
            </div>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={async () => {
                  await loadProfile();
                  setShowProfile(true);
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                👤 My Profile
              </button>
              <button
                onClick={() => {
                  setShowPassword(true);
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                🔑 Change Password
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setNotifOpen(!notifOpen)}
          className="relative hover:bg-gray-100 p-2 rounded-xl">
          🔔
          {count > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>

        {notifOpen && (

          <div className="absolute right-0 top-12 w-96 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">
                Notifications
                {count > 0 && (
                  <span className="ml-2 text-sm text-slate-500">
                    ({count})
                  </span>
                )}
              </h3>
              {count > 0 && (
                <button
                  onClick={readAll}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Read All
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (<div className="p-4 text-sm text-gray-500">No notifications</div>)}
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => openNotification(notif)}
                  className={`p-3 border-b cursor-pointer transition
                  ${!notif.read_at ?
                      "bg-blue-50 border-l-4 hover:bg-blue-100" :
                      "bg-white hover:bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notif.title}</p>

                    {!notif.read_at && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />)}
                  </div>

                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <p className="text-xs text-gray-400">{timeAgo(notif.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Profile */}
        {showProfile && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[500px]">
              <h2 className="text-xl font-bold mb-4">My Profile</h2>

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value
                  })
                }
                className="w-full border p-2 rounded mb-3" />

              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value
                  })
                }
                className="w-full border p-2 rounded mb-3" />

              <input
                value={profile.role}
                disabled
                className="w-full border p-2 rounded mb-3 bg-gray-100" />

              <input
                value={profile.department}
                disabled
                className="w-full border p-2 rounded bg-gray-100" />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() =>
                    setShowProfile(false)
                  }
                  className="border px-4 py-2 rounded">
                  Cancel
                </button>

                <button
                  disabled={!isChanged}
                  onClick={saveProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* end My Profile */}


        {/* Show Change Password */}
        {showPassword && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[500px]">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>

              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    current_password:
                      e.target.value
                  })
                }
                className="w-full border p-2 rounded mb-3" />

              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password:
                      e.target.value
                  })
                }
                className="w-full border p-2 rounded mb-3" />

              <input
                type="password"
                placeholder="Confirm Password"
                value={
                  passwordForm.new_password_confirmation
                }
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password_confirmation:
                      e.target.value
                  })
                }
                className="w-full border p-2 rounded mb-4" />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() =>
                    setShowPassword(false)
                  }
                  className="border px-4 py-2 rounded">
                  Cancel
                </button>

                <button
                  onClick={changePassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
        {/* end show change password */}
      </div >
    </header>
  );
}