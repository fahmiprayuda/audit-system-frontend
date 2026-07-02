export default function TaskQueueTabs({
    summary,
    selectedQueue,
    onChange,
}) {

    const queues = [
        {
            key: "new",
            label: "New Action Plans",
        },
        {
            key: "revision",
            label: "Revision Required",
        },
        {
            key: "site",
            label: "Site Validation",
        },
        {
            key: "waiting",
            label: "Waiting Review",
        },
        {
            key: "all",
            label: "All Tasks",
        },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {queues.map((queue) => (
                <button
                    key={queue.key}
                    onClick={() => onChange(queue.key)}
                    className={`
                        flex items-center gap-2
                        px-5 py-3 rounded-xl border
                        transition-all
                        ${selectedQueue === queue.key
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }
                    `}
                >
                    <span className="font-medium">
                        {queue.label}
                    </span>

                    <span
                        className={`
                            px-2 py-0.5 rounded-full text-xs font-semibold
                            ${selectedQueue === queue.key
                                ? "bg-white/20"
                                : "bg-slate-100 text-slate-600"
                            }
                        `}
                    >
                        {summary[queue.key] ?? 0}
                    </span>
                </button>
            ))}
        </div>
    );
}