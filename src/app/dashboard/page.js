"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import StatusBadge from "@/components/badges/StatusBadge";

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
];

/* =========================
   helpers
========================= */

function mapStatus(status) {
    const map = {
        draft: "Open",
        submitted: "Need Further Review",
        need_revision:
            "Need Further Review",
        approved: "Closed",
    };

    return map[status] || status;
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(
        date
    ).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

export default function DashboardPage() {
    const [summary, setSummary] =
        useState(null);

    const [statusData, setStatusData] =
        useState([]);

    const [
        departmentData,
        setDepartmentData,
    ] = useState([]);

    const [
        overduePlans,
        setOverduePlans,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        try {
            const [
                summaryRes,
                statusRes,
                deptRes,
                overdueRes,
            ] = await Promise.all([
                api.get(
                    "/dashboard/summary"
                ),

                api.get(
                    "/dashboard/action-plans-by-status"
                ),

                api.get(
                    "/dashboard/overdue-by-department"
                ),

                api.get(
                    "/dashboard/overdue-action-plans"
                ),
            ]);

            setSummary(
                summaryRes.data
            );

            /* pie chart merge statuses */
            const mergedStatus = {
                Open: 0,
                "Need Further Review":
                    0,
                Closed: 0,
            };

            statusRes.data.forEach(
                (item) => {
                    const name =
                        mapStatus(
                            item.status
                        );

                    mergedStatus[
                        name
                    ] += item.total;
                }
            );

            setStatusData([
                {
                    name: "Open",
                    value:
                        mergedStatus.Open,
                },
                {
                    name:
                        "Need Further Review",
                    value:
                        mergedStatus[
                        "Need Further Review"
                        ],
                },
                {
                    name: "Closed",
                    value:
                        mergedStatus.Closed,
                },
            ]);

            setDepartmentData(
                deptRes.data
            );

            /* map overdue status */
            const mappedOverdue =
                overdueRes.data.map(
                    (item) => ({
                        ...item,
                        status:
                            mapStatus(
                                item.status
                            ),
                    })
                );

            setOverduePlans(
                mappedOverdue
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

    const summaryCards = [
        {
            title: "Open",
            value:
                summary?.draft || 0,
            color:
                "bg-amber-100 text-amber-700",
        },

        {
            title: "Need Further Review",
            value:
                (summary?.submitted ||
                    0) +
                (summary?.need_revision ||
                    0),
            color:
                "bg-blue-100 text-blue-700",
        },

        {
            title: "Closed",
            value:
                summary?.approved ||
                0,
            color:
                "bg-green-100 text-green-700",
        },

        {
            title: "Overdue",
            value:
                summary?.overdue ||
                0,
            color:
                "bg-red-100 text-red-700",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Internal Audit
                        Dashboard
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Monitor
                        action plans &
                        audit progress
                    </p>
                </div>

                {/* cards */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map(
                        (card) => (
                            <div
                                key={
                                    card.title
                                }
                                className="rounded-2xl bg-white p-5 shadow-sm border"
                            >
                                <p className="text-sm text-slate-500">
                                    {
                                        card.title
                                    }
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-3xl font-bold text-slate-800">
                                        {
                                            card.value
                                        }
                                    </p>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${card.color}`}
                                    >
                                        {
                                            card.title
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* charts */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* donut */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Action Plan
                            Status
                        </h2>

                        <div className="h-72">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={
                                            statusData
                                        }
                                        dataKey="value"
                                        innerRadius={
                                            65
                                        }
                                        outerRadius={
                                            95
                                        }
                                    >
                                        {statusData.map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <Cell
                                                    key={
                                                        index
                                                    }
                                                    fill={
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* bar */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Overdue by
                            Department
                        </h2>

                        <div className="h-72">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        departmentData
                                    }
                                >
                                    <XAxis dataKey="name" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="total"
                                        radius={[
                                            8,
                                            8,
                                            0,
                                            0,
                                        ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* table */}
                <div className="rounded-2xl border bg-white shadow-sm">

                    <div className="border-b p-5">
                        <h2 className="text-lg font-semibold">
                            Overdue
                            Action Plans
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-3 text-left">
                                        Finding
                                    </th>

                                    <th className="px-5 py-3 text-left">
                                        Department
                                    </th>

                                    <th className="px-5 py-3 text-left">
                                        Due
                                    </th>

                                    <th className="px-5 py-3 text-left">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {overduePlans
                                    .length ===
                                    0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                4
                                            }
                                            className="px-5 py-8 text-center text-slate-500"
                                        >
                                            No
                                            overdue
                                            action
                                            plans
                                        </td>
                                    </tr>
                                ) : (
                                    overduePlans.map(
                                        (
                                            item
                                        ) => (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                                className="border-t hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4 font-medium">
                                                    {
                                                        item
                                                            .finding_department
                                                            ?.finding
                                                            ?.title
                                                    }
                                                </td>

                                                <td className="px-5 py-4">
                                                    {
                                                        item
                                                            .finding_department
                                                            ?.department
                                                            ?.name
                                                    }
                                                </td>

                                                <td className="px-5 py-4">
                                                    {formatDate(
                                                        item.due_date
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <StatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />
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