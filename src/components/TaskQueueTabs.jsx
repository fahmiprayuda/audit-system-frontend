import {
    Clock3,
    FilePlus2,
    ListTodo,
    RefreshCcw,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";

export default function TaskQueueTabs({
    summary = {},
    selectedQueue,
    onChange,
}) {
    const newCount = summary.new ?? 0;
    const revisionCount = summary.revision ?? 0;
    const overdueCount = summary.overdue ?? 0;
    const siteCount = summary.site ?? 0;

    const queues = [
        {
            key: "all",
            label: "All Tasks",
            icon: ListTodo,
            count: summary.all ?? 0,
        },
        {
            key: "new",
            label: "New Action Plans",
            icon: FilePlus2,
            count: newCount,
            hasAlert: newCount > 0,
            alertType: "new",
        },
        {
            key: "revision",
            label: "Revision Required",
            icon: RefreshCcw,
            count: revisionCount,
            hasAlert: revisionCount > 0,
            alertType: "revision",
        },
        {
            key: "waiting",
            label: "Waiting Review",
            icon: Clock3,
            count: summary.waiting ?? 0,
        },
        {
            key: "site",
            label: "Site Validation",
            icon: ShieldCheck,
            count: siteCount,
            hasAlert: siteCount > 0,
            alertType: "site",
        },
        {
            key: "overdue",
            label: "Overdue",
            icon: AlertTriangle,
            count: overdueCount,
            hasAlert: overdueCount > 0,
            alertType: "overdue",
        },
    ];

    const getBadgeStyle = (queue, active) => {
        if (queue.hasAlert) {
            switch (queue.alertType) {
                case "new":
                    return "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20";
                case "revision":
                    return "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20";
                case "overdue":
                    return "bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20";
                case "site":
                    return "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20";
                default:
                    return "bg-blue-600 text-white";
            }
        }
        if (active) {
            return "bg-slate-900 text-white";
        }
        return "bg-slate-100 text-slate-600 group-hover:bg-slate-200/70";
    };

    const getPingColor = (alertType) => {
        switch (alertType) {
            case "new":
                return { ping: "bg-blue-400", dot: "bg-blue-600" };
            case "revision":
                return { ping: "bg-amber-400", dot: "bg-amber-500" };
            case "overdue":
                return { ping: "bg-rose-400", dot: "bg-rose-600" };
            case "site":
                return { ping: "bg-indigo-400", dot: "bg-indigo-600" };
            default:
                return { ping: "bg-blue-400", dot: "bg-blue-600" };
        }
    };

    return (
        <div className="flex items-center gap-1 border-b border-slate-200/80 overflow-x-auto no-scrollbar scroll-smooth">
            {queues.map((queue) => {
                const Icon = queue.icon;
                const active = selectedQueue === queue.key;
                const pingColors = queue.hasAlert ? getPingColor(queue.alertType) : null;

                return (
                    <button
                        key={queue.key}
                        type="button"
                        onClick={() => onChange(queue.key)}
                        className={`group relative flex items-center gap-2.5 px-4 py-3 border-b-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                            active
                                ? "border-slate-900 text-slate-900 bg-slate-50/50"
                                : queue.hasAlert
                                ? "border-transparent text-slate-800 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/40"
                                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50/30"
                        }`}
                    >
                        {/* Live Ping Notification Dot when items need attention */}
                        {queue.hasAlert && (
                            <span className="relative flex h-2 w-2 mr-0.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingColors.ping}`} />
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${pingColors.dot}`} />
                            </span>
                        )}

                        <Icon
                            size={16}
                            className={`transition-colors ${
                                active
                                    ? "text-slate-900"
                                    : queue.hasAlert && queue.alertType === "new"
                                    ? "text-blue-600"
                                    : queue.hasAlert && queue.alertType === "revision"
                                    ? "text-amber-600"
                                    : queue.hasAlert && queue.alertType === "overdue"
                                    ? "text-rose-600"
                                    : "text-slate-400 group-hover:text-slate-600"
                            }`}
                        />
                        <span>{queue.label}</span>
                        <span
                            className={`min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${getBadgeStyle(
                                queue,
                                active
                            )}`}
                        >
                            {queue.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
