export default function FlagBadge({ flag }) {
  const normalized = flag?.toLowerCase();

  const styles = {
    submitted: "bg-blue-50 text-blue-700 border-blue-200",
    revision_required: "bg-orange-50 text-orange-700 border-orange-200",
    overdue: "bg-red-50 text-red-700 border-red-200 font-semibold",
    on_site_validation: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const label = normalized
    ?.replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Flag";

  const currentClass = styles[normalized] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${currentClass}`}
    >
      {normalized === "overdue" && <span className="mr-1">⚠️</span>}
      {label}
    </span>
  );
}
