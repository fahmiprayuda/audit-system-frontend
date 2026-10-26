export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const styles = {
    open: {
      badge: "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/10",
      dot: "bg-blue-500",
    },
    need_further_review: {
      badge: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10",
      dot: "bg-amber-500",
    },
    in_progress: {
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/10",
      dot: "bg-indigo-500",
    },
    closed: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10",
      dot: "bg-emerald-500",
    },
  };

  const label = normalized
    ?.replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown";

  const current = styles[normalized] || {
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${current.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{label}</span>
    </span>
  );
}
