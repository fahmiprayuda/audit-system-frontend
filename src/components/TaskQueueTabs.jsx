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
            count: summary.new ?? 0,
        },
        {
            key: "revision",
            label: "Revision Required",
            icon: RefreshCcw,
            count: summary.revision ?? 0,
            badgeClass: summary.revision > 0 ? "bg-amber-100 text-amber-800" : null,
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
            count: summary.site ?? 0,
        },
        {
            key: "overdue",
            label: "Overdue",
            icon: AlertTriangle,
            count: summary.overdue ?? 0,
            badgeClass: summary.overdue > 0 ? "bg-rose-100 text-rose-700 font-bold" : null,
        },
    ];

    return (
        <div className="flex items-center gap-1 border-b border-slate-200/80 overflow-x-auto no-scrollbar scroll-smooth">
            {queues.map((queue) => {
                const Icon = queue.icon;
                const active = selectedQueue === queue.key;

                return (
                    <button
                        key={queue.key}
                        type="button"
                        onClick={() => onChange(queue.key)}
                        className={`group relative flex items-center gap-2.5 px-4 py-3 border-b-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                            active
                                ? "border-slate-900 text-slate-900 bg-slate-50/50"
                                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50/30"
                        }`}
                    >
                        <Icon
                            size={16}
                            className={`transition-colors ${
                                active
                                    ? "text-slate-900"
                                    : "text-slate-400 group-hover:text-slate-600"
                            }`}
                        />
                        <span>{queue.label}</span>
                        <span
                            className={`min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                                active
                                    ? "bg-slate-900 text-white"
                                    : queue.badgeClass
                                    ? queue.badgeClass
                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/70"
                            }`}
                        >
                            {queue.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}