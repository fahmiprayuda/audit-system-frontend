"use client";

import StatusSummary from "@/components/dashboard/monitoring/StatusSummary";
import FlagSummary from "@/components/dashboard/monitoring/FlagSummary";
import ExecutiveSummary from "@/components/dashboard/overview/ExecutiveSummary";
import FlagDetailModal from "@/components/dashboard/monitoring/FlagDetailModal";

export default function Overview({ data, period, setPeriod, fetchData }) {

    const summary = data?.summary || {};

    return (

        <div className="space-y-14">


            <ExecutiveSummary
                data={data}
                period={period}
                setPeriod={setPeriod}
                onApply={fetchData}
            />

            <StatusSummary
                summary={summary}
            />

            <FlagSummary
                summary={summary}
            />

        </div>

    );

}