"use client";

export default function PlanStatusCard({
    value,
    total = 0,

    badge,
    badgeColor,

    icon,
    iconColor,

    description,
}) {

    const percent =
        total > 0
            ? Math.round((value / total) * 100)
            : 0;

    const progressColor =
        badge.includes("OPEN")
            ? "bg-blue-500"
            : badge.includes("NEED")
                ? "bg-orange-500"
                : "bg-green-500";

    return (

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

            {/* ================= HEADER ================= */}

            <div className="p-7">

                <div className="flex justify-between">

                    <div className="flex gap-5">

                        <div
                            className={`w-20 h-20 rounded-3xl flex items-center justify-center ${iconColor}`}
                        >
                            {icon}
                        </div>

                        <div>

                            <span
                                className={`inline-flex mt-3 px-3 py-1 rounded-full text-xl font-bold tracking-wide ${badgeColor}`}
                            >
                                {badge}
                            </span>

                        </div>

                    </div>

                    <div className="text-right">

                        <p className="text-3xl font-bold tracking-tight text-slate-900">
                            {value}
                        </p>

                        <p className="text-slate-400 font-medium mt-1">
                            {percent}% of total {total}
                        </p>

                    </div>

                </div>

                {/* ================= PROGRESS ================= */}

                <div className="mt-8">

                    <div className="flex justify-between text-sm mb-2">

                        <span className="text-slate-500">
                            Progress
                        </span>

                        <span className="font-semibold text-slate-700">
                            {percent}%
                        </span>

                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                            className={`${progressColor} h-full rounded-full transition-all duration-700`}
                            style={{
                                width: `${percent}%`,
                            }}
                        />

                    </div>

                </div>

            </div>

            {/* ================= FOOTER ================= */}

            <div className="border-t bg-slate-50 px-7 py-5 flex justify-between items-center">

                <p className="text-sm text-slate-600">
                    {description}
                </p>

            </div>

        </div>

    );
}