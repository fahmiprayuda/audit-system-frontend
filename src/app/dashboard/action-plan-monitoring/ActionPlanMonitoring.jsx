"use client";

import { useState } from "react";

import useActionPlanMonitoring from "@/hooks/useActionPlanMonitoring";

import MonitoringHeader from "@/components/dashboard/monitoring/MonitoringHeader";
import MonitoringTabs from "@/components/dashboard/monitoring/MonitoringTabs";

import Overview from "@/components/dashboard/monitoring/Overview";
import Analytics from "@/components/dashboard/monitoring/Analytics";
import CardSkeleton from "@/components/ui/CardSkeleton";

export default function ActionPlanMonitoring() {

    const {
        data,
        loading,
        fetchData,
    } = useActionPlanMonitoring();

    const [tab, setTab] =
        useState("overview");

    const [period, setPeriod] = useState([
        null,
        null,
    ]);

    if (!data) {
        return (
            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
                <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
                <CardSkeleton count={4} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-72 bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                    </div>
                    <div className="h-72 bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>

            {/* <MonitoringHeader /> */}

            <MonitoringTabs
                tab={tab}
                setTab={setTab}
            />

            {
                tab === "overview"

                    ? (
                        <Overview
                            data={data}
                            period={period}
                            setPeriod={setPeriod}
                            fetchData={fetchData}
                        />
                    )

                    : (
                        <Analytics
                            data={data}
                        />
                    )

            }

        </>
    );
}