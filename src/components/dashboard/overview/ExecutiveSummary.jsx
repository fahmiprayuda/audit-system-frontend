"use client";

import { formatDate } from "@/utils/date";
import { ClipboardList, CalendarDays } from "lucide-react";
import PeriodFilter from "@/components/dashboard/overview/PeriodFilter";
import { format } from "date-fns";

export default function ExecutiveSummary({
    data,
    period,
    setPeriod,
    onApply,
}) {

    const [startDate, endDate] = period;

    return (

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

            <div className="flex justify-between items-start">



                <div className="flex gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">

                        <ClipboardList
                            size={42}
                            className="text-slate-700"
                        />

                    </div>

                    <div>

                        <p className="text-slate-500 text-sm uppercase tracking-wider">
                            Executive Summary
                        </p>

                        <h2 className="text-5xl font-bold mt-3">
                            {data?.total_action_plans ?? 0}
                        </h2>

                        <p className="text-slate-500 mt-3">
                            Total Action Plans
                        </p>

                    </div>

                </div>

                <div className="w-[420px]">

                    <p className="uppercase text-xs tracking-widest text-slate-400 mb-3">
                        Reporting Period
                    </p>

                    <PeriodFilter
                        period={period}
                        setPeriod={setPeriod}
                        onApply={onApply}
                    />

                    <p className="text-xs text-slate-400 mt-3">
                        Data is filtered by Audit Project Release Date.
                    </p>

                </div>
            </div>
        </div>

    );

}