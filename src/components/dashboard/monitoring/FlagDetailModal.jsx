"use client";

import { CHART_COLORS } from "@/constants/chartColors";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatDate } from "@/utils/date";
import DepartmentPieChart from "@/components/dashboard/monitoring/DepartmentPieChart";

import {
    X,
    AlertTriangle,
} from "lucide-react";

export default function FlagDetailModal({
    open,
    onClose,
    flag,
}) {


    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const departmentDistribution =
        data?.department_distribution ?? [];

    const summary =
        data?.summary ?? {};

    useEffect(() => {

        if (!open || !flag) return;

        fetchData();

    }, [open, flag]);

    const fetchData = async () => {

        try {

            setLoading(true);

            const res = await api.get(
                "/dashboard/action-plan-monitoring/flag-details",
                {
                    params: {
                        flag,
                    },
                }
            );

            setData(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    if (!open) return null;

    const titles = {
        overdue: "Overdue Action Plans",
        submitted: "Submitted Action Plans",
        revision_required: "Revision Required",
        on_site_validation: "On Site Validation",
    };

    console.log(data);

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Backdrop */}

            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal */}

            <div className="relative bg-white rounded-3xl shadow-2xl w-[1200px] max-w-[95vw] h-[85vh] overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between px-8 py-6 border-b">

                    <div>

                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Action Plan Monitoring
                        </p>

                        <h2 className="text-3xl font-bold mt-1">
                            {titles[flag]}
                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="p-8 overflow-y-auto h-[calc(85vh-88px)] space-y-8">

                    {/* KPI */}

                    <div className="grid grid-cols-4 gap-5">

                        <div className="rounded-2xl border p-5">

                            <p className="text-md text-slate-500">
                                Total
                            </p>

                            <h3 className="text-4xl font-bold mt-2">
                                {summary.total}
                            </h3>

                        </div>

                        <div className="rounded-2xl border p-5">

                            <p className="text-md text-slate-500">
                                Departments
                            </p>

                            <h3 className="text-4xl font-bold mt-2">
                                {summary.departments}
                            </h3>

                        </div>

                        <div className="rounded-2xl border p-5">

                            <p className="text-md text-slate-500">
                                Oldest
                            </p>

                            <h3 className="text-4xl font-bold mt-2">
                                {summary.oldest_days}
                                <span className="text-lg font-medium text-slate-400 ml-1">
                                    days
                                </span>
                            </h3>

                        </div>

                        <div className="rounded-2xl border p-5">

                            <p className="text-md text-slate-500">
                                Average
                            </p>

                            <h3 className="text-4xl font-bold mt-2">
                                {summary.average_days}
                                <span className="text-lg font-medium text-slate-400 ml-1">
                                    days
                                </span>
                            </h3>

                        </div>

                    </div>

                    {/* Chart + Summary */}

                    <div className="grid grid-cols-3 gap-6">

                        <div className="col-span-1 rounded-2xl border p-6">

                            <h3 className="font-semibold text-lg">
                                Department Distribution
                            </h3>

                            <DepartmentPieChart
                                data={departmentDistribution}
                            />

                        </div>

                        <div className="col-span-2 rounded-2xl border p-6">

                            <h3 className="font-semibold text-lg mb-4">
                                Summary
                            </h3>

                            <div className="space-y-5">

                                {departmentDistribution.map((item, index) => {

                                    const percent =
                                        summary.total
                                            ? Math.round(item.total / summary.total * 100)
                                            : 0;

                                    return (

                                        <div key={item.department}>

                                            <div className="h-2 rounded-full bg-slate-100">

                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${percent}%`,
                                                        background:
                                                            CHART_COLORS[index % CHART_COLORS.length]
                                                    }}
                                                />

                                                <span className="font-medium">
                                                    {item.department}
                                                </span>

                                            </div>

                                            <div className="text-right">

                                                <p className="font-semibold">
                                                    {item.total}
                                                </p>

                                                <p className="text-sm text-slate-400">
                                                    {percent}%
                                                </p>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    </div>

                    {/* Table */}

                    <div className="rounded-2xl border overflow-hidden">

                        <div className="px-6 py-5 border-b bg-slate-50">

                            <h3 className="font-semibold text-lg">
                                Action Plan List
                            </h3>

                        </div>

                        <table className="w-full">

                            <thead className="bg-slate-100">

                                <tr>

                                    <th className="px-5 py-4 text-left">
                                        Finding
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Department
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Due Date
                                    </th>

                                    <th className="px-5 py-4 text-left">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="py-20 text-center"
                                        >
                                            Loading...
                                        </td>

                                    </tr>

                                ) : (

                                    data?.items?.map(item => (

                                        <tr
                                            key={item.id}
                                        >

                                            <td className="px-5 py-4">

                                                {item.finding_department.finding.finding_code}

                                            </td>

                                            <td className="px-5 py-4">

                                                {item.finding_department.department.name}

                                            </td>

                                            <td className="px-5 py-4">

                                                {formatDate(item.due_date)}

                                            </td>

                                            <td className="px-5 py-4">

                                                {titles[item.flags]}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}