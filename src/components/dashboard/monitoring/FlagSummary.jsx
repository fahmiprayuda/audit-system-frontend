"use client"
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react"
import FlagCard from "@/components/dashboard/monitoring/FlagCard"

export default function FlagSummary({
    summary,
}) {
    return (
        <><div className="mb-8 mt-10">
            <h1 className="text-3xl font-bold">
                Action Plan Monitoring Flags
            </h1>

            <p className="text-slate-500 mt-2">
                Monitor flags of action plans
            </p>
        </div>

            {/* Summary Cards Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

                <FlagCard
                    title="High Alert"
                    value={summary.overdue}
                    subtitle="Overdue Items"
                    description="Action plans that have exceeded their assigned deadline."
                    footer="View Details"
                    color="text-red-500"
                    bgColor="bg-red-100"
                    footerColor="text-blue-600"
                    icon={<AlertTriangle size={15} />}
                />

                <FlagCard
                    title="Success"
                    value={summary.submitted}
                    subtitle="Submitted"
                    description="Successfully submitted for auditor evaluation."
                    footer="Review Now"
                    color="text-emerald-500"
                    bgColor="bg-emerald-100"
                    footerColor="text-emerald-600"
                    icon={<CheckCircle2 size={15} />}
                />

                <FlagCard
                    title="Revision"
                    value={summary.revision_required}
                    subtitle="Revision Required"
                    description="Auditee needs to make corrections to the action plan."
                    footer="Manage"
                    color="text-red-500"
                    bgColor="bg-red-100"
                    footerColor="text-slate-500"
                    icon={<AlertTriangle size={15} />}
                />

                <FlagCard
                    title="In-Person"
                    value={summary.on_site_validation}
                    subtitle="Site Validation"
                    description="Requires physical verification at the facility."
                    footer="Schedule"
                    color="text-orange-500"
                    bgColor="bg-orange-100"
                    footerColor="text-slate-500"
                    icon={<MapPin size={15} />}
                />

            </div>

        </>
    )
}