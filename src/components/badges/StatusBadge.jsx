export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const map = {
    open: "bg-blue-500 text-white",
    need_further_review: "bg-gray-500 text-white",
    in_progress: "bg-green-400 text-black",
    closed: "bg-gray-700 text-white",
  };

  const label = normalized
    ?.replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${map[normalized] || "bg-gray-400 text-white"
        }`}
    >
      {label}
    </span>
  );
}