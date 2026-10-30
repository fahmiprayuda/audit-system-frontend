"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext({
  showToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", message, title, duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
      const newToast = { id, type, message, title };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = "Success") => showToast({ type: "success", message, title }),
    [showToast]
  );

  const error = useCallback(
    (message, title = "Error") => showToast({ type: "error", message, title }),
    [showToast]
  );

  const warning = useCallback(
    (message, title = "Warning") => showToast({ type: "warning", message, title }),
    [showToast]
  );

  const info = useCallback(
    (message, title = "Notice") => showToast({ type: "info", message, title }),
    [showToast]
  );

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200/80 bg-white shadow-emerald-900/5",
    error: "border-rose-200/80 bg-white shadow-rose-900/5",
    warning: "border-amber-200/80 bg-white shadow-amber-900/5",
    info: "border-sky-200/80 bg-white shadow-sky-900/5",
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
              borders[t.type] || borders.info
            }`}
          >
            {icons[t.type] || icons.info}
            <div className="flex-1 min-w-0 pr-1">
              {t.title && (
                <div className="text-xs font-bold text-slate-900 tracking-tight mb-0.5">
                  {t.title}
                </div>
              )}
              <div className="text-xs text-slate-600 leading-relaxed break-words">
                {t.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
