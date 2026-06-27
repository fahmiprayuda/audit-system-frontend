"use client";

import PlanStatusCard from "@/components/dashboard/monitoring/PlanStatusCard";

import {
    Clock3,
    CheckCircle2,
    SearchCheck,
} from "lucide-react";

export default function StatusSummary({
    summary,
}) {

    return (
        <>
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-4xl font-bold tracking-wide">
                            Action Plan Monitoring Status
                        </h2>
                        <p className="text-slate-500 mt-3 text-lg">
                            Tracking the lifecycle of active action plans
                        </p>
                    </div>

                    <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-semibold">
                        UPDATED JUST NOW
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

                <PlanStatusCard
                    title="Open Plans"
                    value={summary.open}
                    badge="OPEN"
                    badgeColor="bg-blue-50 text-blue-600"
                    icon={<Clock3 size={34} />}
                    iconColor="bg-blue-50 text-blue-600"
                    dotColor="bg-blue-500"
                    description="Awaiting initial auditee response"
                />

                <PlanStatusCard
                    title="Further Review"
                    value={summary.need_further_review}
                    badge="NEED FURTHER REVIEW"
                    badgeColor="bg-orange-50 text-orange-600"
                    icon={<SearchCheck size={34} />}
                    iconColor="bg-orange-50 text-orange-600"
                    dotColor="bg-orange-500"
                    description="Currently in auditor verification"
                />

                <PlanStatusCard
                    title="Closed Plans"
                    value={summary.closed}
                    badge="CLOSED"
                    badgeColor="bg-green-50 text-green-600"
                    icon={<CheckCircle2 size={34} />}
                    iconColor="bg-green-50 text-green-600"
                    dotColor="bg-green-500"
                    description="No completed cycles in this period"
                />

            </div>

        </>
    )
}