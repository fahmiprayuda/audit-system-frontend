"use client";

import { useState } from "react";

import useActionPlanMonitoring from "@/hooks/useActionPlanMonitoring";

import MonitoringHeader from "@/components/dashboard/monitoring/MonitoringHeader";
import MonitoringTabs from "@/components/dashboard/monitoring/MonitoringTabs";

import Overview from "@/components/dashboard/monitoring/Overview";
import Analytics from "@/components/dashboard/monitoring/Analytics";

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

    if (!data)
        return <p>Loading...</p>;

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