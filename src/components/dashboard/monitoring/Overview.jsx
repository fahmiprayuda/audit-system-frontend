"use client";

import StatusSummary from "@/components/dashboard/monitoring/StatusSummary";
import FlagSummary from "@/components/dashboard/monitoring/FlagSummary";

export default function Overview({ data }) {

    const summary = data?.summary || {};

    return (

        <div className="space-y-14">

            <StatusSummary
                summary={summary}
            />

            <FlagSummary
                summary={summary}
            />

        </div>

    );

}