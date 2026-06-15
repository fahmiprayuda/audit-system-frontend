"use client";

import { formatDate } from "@/utils/date";

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

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [departmentData, setDepartmentData] = useState([]);
    const [topFindings, setTopFindings] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);

    const [selectedFinding, setSelectedFinding] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openProject = async (id) => {

        const res =
            await api.get(
                `/dashboard/projects/${id}/details`
            );

        setSelectedProject(
            res.data
        );

        setShowProjectModal(true);
    };

    const openDetail = async (id) => {

        const res = await api.get(
            `/dashboard/findings/${id}/details`
        );

        console.table(res.data.actions);

        setSelectedFinding(
            res.data
        );

        setShowModal(true);
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const [
                summaryRes,
                departmentRes,
                findingsRes,
                projectsRes
            ] = await Promise.all([
                api.get("/dashboard/executive-summary"),
                api.get("/dashboard/overdue-findings-by-department"),
                api.get("/dashboard/top-overdue-findings"),
                api.get("/dashboard/project-portfolio"),
            ]);
            setSummary(summaryRes.data);
            setDepartmentData(departmentRes.data);
            setTopFindings(findingsRes.data);
            setProjects(projectsRes.data);
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
            title: "Total Findings",
            value: summary?.total_findings || 0,
            color: "bg-slate-100 text-slate-700",
            icon: "📋",
        },
        {
            title: "Open Findings",
            value: summary?.open_findings || 0,
            color: "bg-red-100 text-red-700",
            icon: "🔥",
        },
        {
            title: "Due Soon",
            value: summary?.due_soon || 0,
            color: "bg-amber-100 text-amber-700",
            icon: "⚠️",
        },
        {
            title: "Closed Findings",
            value: summary?.closed_findings || 0,
            color: "bg-green-100 text-green-700",
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
                        Open Findings by Department
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
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 text-left">
                                        Finding
                                    </th>
                                    <th className="p-3 text-left">
                                        Department
                                    </th>
                                    <th className="p-3 text-center">
                                        Max Overdue
                                    </th>
                                    <th className="p-3 text-center">
                                        Open Actions Plan
                                    </th>
                                    <th className="p-3 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {topFindings.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-8 text-slate-500">
                                            No overdue findings
                                        </td>
                                    </tr>
                                ) : (
                                    topFindings.map(
                                        (item) => (
                                            <tr key={item.id} className="border-t hover:bg-slate-50">
                                                <td className="p-3">
                                                    <div className="font-medium">
                                                        {item.finding_code}
                                                    </div>
                                                    <div className="text-slate-500 text-xs">
                                                        {item.title}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {item.departments}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 font-medium">
                                                        {item.days_overdue} Days
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 font-medium">
                                                        {item.overdue_actions}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => openDetail(item.id)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                                            View Detail
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-5 border-b">
                        <h2 className="text-lg font-semibold">Project Portfolio</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th rowSpan={2} className="p-4 text-left">Project</th>
                                    <th rowSpan={2} className="p-4 text-center">Total Findings</th>
                                    <th colSpan={2} className="p-4 text-center">Risk Category</th>
                                    <th colSpan={2} className="p-4 text-center">Status</th>
                                    {/* <th rowSpan={2} className="p-4 text-center">Progress</th> */}
                                    <th rowSpan={2} className="p-4 text-center">Action</th>
                                </tr>
                                <tr>
                                    <th className="p-4 text-center">Significant</th>
                                    <th className="p-4 text-center">Moderate</th>
                                    <th className="p-4 text-center">Open</th>
                                    <th className="p-4 text-center">Closed</th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="font-medium">{item.project_code}</div>
                                            <div className="text-xs text-slate-500">{item.project_name}</div>
                                        </td>
                                        <td className="p-4 text-center">{item.total_findings}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded bg-red-100 text-red-700">{item.significant_findings}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">{item.moderate_findings}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded bg-red-100 text-red-700">{item.open_findings}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded bg-green-100 text-green-700">{item.closed_findings}</span>
                                        </td>
                                        {/* <td className="p-4 min-w-[150px]">
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width:
                                                            `${item.completion_percent}%`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs mt-1">{item.completion_percent}%</p>
                                        </td> */}

                                        <td className="p-4">
                                            <div className="flex justify-center gap-x-2">
                                                <button
                                                    onClick={() => openProject(item.id)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                                    Detail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Start Modal Detail Project */}
            {showProjectModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[1000px] max-h-[80vh] overflow-auto">

                        <div className="p-5 border-b flex justify-between">

                            <div>

                                <h2 className="font-bold text-xl">

                                    {selectedProject?.project_code}

                                </h2>

                                <p className="text-gray-500">

                                    {selectedProject?.project_name}

                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowProjectModal(false)
                                }
                            >
                                ❌
                            </button>

                        </div>

                        <div className="p-5">

                            <table className="w-full">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="p-3 text-left">
                                            Finding
                                        </th>

                                        <th className="p-3 text-center">
                                            Risk
                                        </th>

                                        <th className="p-3 text-center">
                                            Category
                                        </th>

                                        <th className="p-3 text-center">
                                            Status
                                        </th>

                                        <th className="p-3 text-center">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {selectedProject?.findings?.map(
                                        (finding) => (

                                            <tr
                                                key={finding.id}
                                                className="border-t"
                                            >

                                                <td className="p-3">

                                                    <div className="font-medium">

                                                        {finding.finding_code}

                                                    </div>

                                                    <div className="text-xs text-slate-500">

                                                        {finding.title}

                                                    </div>

                                                </td>

                                                <td className="p-3 text-center">

                                                    {finding.risk_rating}

                                                </td>

                                                <td className="p-3 text-center">

                                                    {finding.risk_category}

                                                </td>

                                                <td className="p-3 text-center">

                                                    {finding.status}

                                                </td>

                                                <td className="p-3 text-center">

                                                    <button
                                                        onClick={() => {

                                                            setShowProjectModal(false);

                                                            openDetail(
                                                                finding.id
                                                            );

                                                        }}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            )}
            {/* End Modal Detail Project */}

            {/* Start Modal Detail Finding */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
                    <div className="bg-white rounded-xl w-[900px] max-h-[80vh] overflow-auto">
                        <div className="p-5 border-b flex justify-between">
                            <div>
                                <h2 className="font-bold text-xl">
                                    {selectedFinding?.finding_code}
                                </h2>
                                <p className="text-gray-500">
                                    {selectedFinding?.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                            >
                                ❌
                            </button>
                        </div>

                        <div className="p-5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50">
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Department
                                        </th>

                                        <th className="px-4 py-3 text-left font-semibold">
                                            Root Cause
                                        </th>

                                        <th className="px-4 py-3 text-center font-semibold">
                                            Due Date
                                        </th>

                                        <th className="px-4 py-3 text-center font-semibold">
                                            Days Overdue
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedFinding?.actions?.map(
                                        (action) => (
                                            <tr
                                                key={action.id}
                                                className="border-b hover:bg-slate-50"
                                            >
                                                <td className="px-4 py-4">
                                                    {action.department}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {action.root_cause}
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    {formatDate(
                                                        action.due_date
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    {action.days_overdue > 0 ? (
                                                        <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                                                            {action.days_overdue} Days
                                                        </span>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {/* End Modal Detail Finding */}
        </div>

    );
}