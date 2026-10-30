"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, LogOut, Info, CheckCircle2, Loader2, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "info" | "success" | "logout"
  loading = false,
  error = null,
  showCancel = true,
  icon: CustomIcon,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: CustomIcon || Trash2,
      halo: "bg-rose-100 text-rose-600 ring-rose-50",
      btn: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/20 shadow-rose-200/50",
    },
    logout: {
      icon: CustomIcon || LogOut,
      halo: "bg-rose-100 text-rose-600 ring-rose-50",
      btn: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/20 shadow-rose-200/50",
    },
    warning: {
      icon: CustomIcon || AlertTriangle,
      halo: "bg-amber-100 text-amber-600 ring-amber-50",
      btn: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500/20 shadow-amber-200/50",
    },
    info: {
      icon: CustomIcon || Info,
      halo: "bg-sky-100 text-sky-600 ring-sky-50",
      btn: "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500/20 shadow-sky-200/50",
    },
    success: {
      icon: CustomIcon || CheckCircle2,
      halo: "bg-emerald-100 text-emerald-600 ring-emerald-50",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500/20 shadow-emerald-200/50",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;
  const IconComponent = currentVariant.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-start justify-between">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-8 ${currentVariant.halo}`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            {!loading && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <div className="text-xs text-slate-500 leading-relaxed">
              {message}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-100">
          {showCancel && (
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 ${currentVariant.btn}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
