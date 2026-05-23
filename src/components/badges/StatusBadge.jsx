export default function StatusBadge({ status }) {
  const map = {
    open: "bg-blue-500",
    draft: "bg-gray-500", //need futher review for this status
    submitted: "bg-blue-600",//submitted reviewed by auditor but not yet approved or rejected
    need_revision: "bg-red-500",
    approved: "bg-green-600",
    in_progress: "bg-green-300 text-black",
    closed: "bg-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ${
        map[status] || "bg-gray-400"
      }`}
    >
      {status?.replaceAll("_", " ")}
    </span>
  );
}