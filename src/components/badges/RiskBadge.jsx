export default function RiskBadge({ risk }) {
  const styles = {
    Extreme: {
      badge: "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20",
      dot: "bg-red-500",
    },
    Major: {
      badge: "bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-500/20",
      dot: "bg-orange-500",
    },
    Moderate: {
      badge: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20",
      dot: "bg-amber-500",
    },
    Low: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20",
      dot: "bg-emerald-500",
    },
  };

  const current = styles[risk] || {
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{risk || "Unknown"}</span>
    </span>
  );
}
