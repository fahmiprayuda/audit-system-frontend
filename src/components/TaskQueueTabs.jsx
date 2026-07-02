import {
    Clock3,
    FilePlus2,
    ListTodo,
    RefreshCcw,
    ShieldCheck,
} from "lucide-react";

export default function TaskQueueTabs({
    summary,
    selectedQueue,
    onChange,
}) {

    const queues = [
        {
            key: "all",
            label: "All Tasks",
            icon: ListTodo,
            count: summary.all,
        },
        {
            key: "new",
            label: "New Action Plans",
            icon: FilePlus2,
            count: summary.new,
        },
        {
            key: "revision",
            label: "Revision Required",
            icon: RefreshCcw,
            count: summary.revision,
        },
        {
            key: "waiting",
            label: "Waiting Review",
            icon: Clock3,
            count: summary.waiting,
        },
        {
            key: "site",
            label: "Site Validation",
            icon: ShieldCheck,
            count: summary.site,
        },
    ];

    return (
        <div className="flex items-end justify-between gap-2 border-b border-slate-200 mb-8 overflow-x-auto">

            {queues.map((queue) => {

                const Icon = queue.icon;

                const active = selectedQueue === queue.key;

                return (

                    <button
                        key={queue.key}
                        onClick={() =>
                            onChange(queue.key)
                        }
                        className={`flex-1 shrink-0 group flex items-center gap-3 px-5 pb-4 pt-3 border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap

                ${active
                                ? "border-slate-900"
                                : "border-transparent hover:border-slate-300"
                            }`}
                    >

                        <Icon
                            size={20}
                            className={
                                active
                                    ? "text-slate-900"
                                    : "text-slate-500 group-hover:text-slate-700"
                            }
                        />

                        <span
                            className={`font-medium

                    ${active
                                    ? "text-slate-900"
                                    : "text-slate-600"
                                }`}
                        >
                            {queue.label}
                        </span>

                        <span
                            className={`

                                min-w-6
                                h-6
                                px-2

                                flex
                                items-center
                                justify-center

                                rounded-full

                                text-[11px]
                                font-semibold ${active
                                    ?
                                    "bg-slate-900 text-white"
                                    :
                                    "bg-slate-100 text-slate-600"
                                }
`}
                        >
                            {queue.count ?? 0}
                        </span>

                    </button>

                );

            })}

        </div>

        // <div className="flex flex-wrap gap-3">
        //     {queues.map((queue) => (
        //         <button
        //             key={queue.key}
        //             onClick={() => onChange(queue.key)}
        //             className={`
        //                 flex items-center gap-2
        //                 px-5 py-3 rounded-xl border
        //                 transition-all
        //                 ${selectedQueue === queue.key
        //                     ? "bg-slate-900 text-white border-slate-900"
        //                     : "bg-white border-slate-200 hover:bg-slate-50"
        //                 }
        //             `}
        //         >
        //             <span className="font-medium">
        //                 {queue.label}
        //             </span>

        //             <span
        //                 className={`
        //                     px-2 py-0.5 rounded-full text-xs font-semibold
        //                     ${selectedQueue === queue.key
        //                         ? "bg-white/20"
        //                         : "bg-slate-100 text-slate-600"
        //                     }
        //                 `}
        //             >
        //                 {summary[queue.key] ?? 0}
        //             </span>
        //         </button>
        //     ))}
        // </div>
    );
}