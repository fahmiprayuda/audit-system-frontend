export default function RiskBadge({ risk }) {
  const map = {
    Extreme: "bg-red-700",
    Major: "bg-orange-500",
    Moderate: "bg-yellow-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs ${
        map[risk] || "bg-gray-400"
      }`}
    >
      {risk}
    </span>
  );
}