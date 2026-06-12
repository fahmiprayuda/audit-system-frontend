"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

export default function DashboardPage() {

    const [loading, setLoading] =
        useState(true);

    const [summary, setSummary] =
        useState(null);

    const [
        departmentData,
        setDepartmentData,
    ] = useState([]);

    const [
        topFindings,
        setTopFindings,
    ] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            const [
                summaryRes,
                departmentRes,
                findingsRes,
            ] = await Promise.all([

                api.get(
                    "/dashboard/executive-summary"
                ),

                api.get(
                    "/dashboard/overdue-findings-by-department"
                ),

                api.get(
                    "/dashboard/top-overdue-findings"
                ),
            ]);

            setSummary(
                summaryRes.data
            );

            setDepartmentData(
                departmentRes.data
            );

            setTopFindings(
                findingsRes.data
            );

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    const cards = [

        {
            title:
                "Total Findings",
            value:
                summary?.total_findings || 0,
            color:
                "bg-slate-100 text-slate-700",
            icon: "📋",
        },

        {
            title:
                "Open Findings",
            value:
                summary?.open_findings || 0,
            color:
                "bg-red-100 text-red-700",
            icon: "🔥",
        },

        {
            title:
                "Due Soon",
            value:
                summary?.due_soon || 0,
            color:
                "bg-amber-100 text-amber-700",
            icon: "⚠️",
        },

        {
            title:
                "Closed Findings",
            value:
                summary?.closed_findings || 0,
            color:
                "bg-green-100 text-green-700",
            icon: "✅",
        },
    ];

    return (

        <div className="p-6 bg-slate-50 min-h-screen">

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}

                <div>

                    <h1 className="text-3xl font-bold text-slate-800">

                        Executive Dashboard

                    </h1>

                    <p className="text-slate-500 mt-1">

                        Internal Audit Monitoring

                    </p>

                </div>

                {/* Summary Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    {cards.map((card) => (

                        <div
                            key={card.title}
                            className="bg-white rounded-2xl border shadow-sm p-5"
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-sm text-slate-500">

                                        {card.title}

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {card.value}

                                    </h2>

                                </div>

                                <span
                                    className={`px-3 py-2 rounded-xl text-lg ${card.color}`}
                                >

                                    {card.icon}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

                {/* Chart + Top Findings */}

                {/* Chart */}

                <div className="xl:col-span-1 bg-white rounded-2xl border shadow-sm p-5">

                    <h2 className="font-semibold text-lg mb-4">

                        Overdue Findings by Department

                    </h2>

                    <div className="h-[200px]">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                layout="vertical"
                                data={departmentData}
                            >
                                <XAxis type="number" allowDecimals={false}
                                    tickCount={21} />

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={200}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="overdue_findings"
                                    fill="salmon"
                                    radius={[0, 8, 8, 0]}
                                />
                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* Top Overdue */}

                <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">

                    <div className="p-5 border-b">

                        <h2 className="font-semibold text-lg">

                            Top Overdue Findings 🔥

                        </h2>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="p-3 text-left">

                                        Finding

                                    </th>

                                    <th className="p-3 text-left">

                                        Department

                                    </th>

                                    <th className="p-3 text-center">

                                        Days Overdue

                                    </th>

                                    <th className="p-3 text-center">

                                        Open Actions

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {topFindings.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            className="text-center p-8 text-slate-500"
                                        >

                                            No overdue findings

                                        </td>

                                    </tr>

                                ) : (

                                    topFindings.map(
                                        (item) => (

                                            <tr
                                                key={item.id}
                                                className="border-t hover:bg-slate-50"
                                            >

                                                <td className="p-3">

                                                    <div className="font-medium">

                                                        {
                                                            item.finding_code
                                                        }

                                                    </div>

                                                    <div className="text-slate-500 text-xs">

                                                        {
                                                            item.title
                                                        }

                                                    </div>

                                                </td>

                                                <td className="p-3">

                                                    {
                                                        item.departments
                                                    }

                                                </td>

                                                <td className="p-3 text-center">

                                                    <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 font-medium">

                                                        {
                                                            item.days_overdue
                                                        } Days

                                                    </span>

                                                </td>

                                                <td className="p-3 text-center">

                                                    <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 font-medium">

                                                        {
                                                            item.overdue_actions
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );
}