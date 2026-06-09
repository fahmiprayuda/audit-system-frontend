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

export default function Topbar() {

  const [count, setCount] = useState(0);

  const [notifications, setNotifications] =
    useState([]);

  const [notifOpen, setNotifOpen] =
    useState(false);

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

  const openNotification =
    async (notif) => {

      await api.post(
        `/notifications/${notif.id}/read`
      );

      loadUnread();

      setNotifOpen(false);

      setTimeout(() => {
        router.push(notif.url);
      }, 150);

      if (notif.url) {
        router.push(notif.url);
      }
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

  const [mounted, setMounted] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef(null);



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

  return (
    <header className="ml-20 h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="font-semibold text-lg">
        Audit Monitoring
      </h1>

      <div className="relative flex items-center gap-4 mr-16">

        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div
              className="w-9 h-9 rounded-full
                       bg-blue-600 text-white
                       flex items-center justify-center
                       font-semibold"
            >
              {mounted
                ? user?.name?.charAt(0)
                : ""}
            </div>

            <div className="text-left">
              <p className="text-sm font-medium">
                {mounted
                  ? user?.name ||
                  "User"
                  : ""}
              </p>

              <p className="text-xs text-gray-500">
                {mounted
                  ? user?.email
                  : ""}
              </p>

            </div>


            <ChevronDown
              size={16}
            />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-48
                       bg-white border rounded-lg shadow-lg z-50"
            >
              <button
                className="w-full flex items-center gap-2
                         px-4 py-3 text-sm hover:bg-gray-50"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2
                         px-4 py-3 text-sm
                         text-red-600 hover:bg-red-50"
              >
                <LogOut
                  size={16}
                />
                Logout
              </button>
            </div>
          )}
        </div>

        <button onClick={() =>
          setNotifOpen(
            !notifOpen
          )
        } className="relative hover:bg-gray-100 p-2 rounded-xl">
          🔔
          {count > 0 && (
            <span
              className="
            absolute
            -top-1
            -right-1
            bg-red-500
            text-white
            text-[10px]
            rounded-full
            min-w-[18px]
            h-[18px]
            px-1
            flex
            items-center
            justify-center
          "
            >
              {count}
            </span>
          )}

        </button>

        {notifOpen && (

          <div
            className="
    absolute
    right-0
    top-12
    w-96
    bg-white
    border
    rounded-2xl
    shadow-xl
    z-50
    overflow-hidden
  "
          >

            <div className="p-4 border-b">

              <h3 className="font-semibold">
                Notifications
              </h3>

            </div>

            <div className="max-h-96 overflow-y-auto">

              {notifications.length === 0 && (

                <div className="p-4 text-sm text-gray-500">

                  No notifications

                </div>

              )}

              {notifications.map((notif) => (

                <div
                  key={notif.id}
                  onClick={() => openNotification(notif)}
                  className={`
                      p-3 border-b cursor-pointer transition
                      ${!notif.read_at
                      ? "bg-blue-50 border-l-4 hover:bg-blue-100"
                      : "bg-white hover:bg-gray-50"
                    }`}
                >

                  <div className="flex items-center justify-between">

                    <p className="font-medium">
                      {notif.title}
                    </p>

                    {!notif.read_at && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}

                  </div>

                  <p className="text-sm text-gray-600">
                    {notif.message}
                  </p>

                  <p className="text-xs text-gray-400">
                    {timeAgo(notif.created_at)}
                  </p>

                </div>

              ))}

            </div>

          </div>

        )}


      </div >

    </header>

  );
}