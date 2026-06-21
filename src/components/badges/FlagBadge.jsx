export default function FlagBadge({ flag }) {
    const normalized = flag?.toLowerCase();

    const map = {
        submitted: "bg-blue-100 text-blue-700",
        revision_required: "bg-orange-100 text-orange-700",
        overdue: "bg-red-100 text-red-700",
    };

    const label = normalized
        ?.replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <span
            className={`px-3 py-1 rounded-full text-white text-xs ${map[normalized] || "bg-green-500"
                } `}
        >
            {label}
        </span>
    );
}