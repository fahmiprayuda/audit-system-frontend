"use client";

import { formatDate } from "@/utils/date";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { getUser } from "@/utils/auth";

import { COLOR, LABEL } from "@/components/badges/WorkflowBadge";

import TaskQueueTabs from "@/components/TaskQueueTabs";
import TableSkeleton from "@/components/ui/TableSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { CheckCircle2, ClipboardCheck } from "lucide-react";

export default function MyTasksPage() {

    const router = useRouter();
    const user = getUser();

    const [data, setData] = useState(null);

    const [selectedQueue, setSelectedQueue] = useState("all");
    const [loading, setLoading] = useState(false);

    const fetchTasks = async (queue = "all") => {
        try {

            setLoading(true);

            const url =
                queue === "all"
                    ? "/my-tasks"
                    : `/my-tasks?queue=${queue}`;

            const res = await api.get(url);

            setData(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (!data) {
        return (
            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-4 w-96 bg-slate-200 rounded-xl animate-pulse" />
                </div>
                <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                <TableSkeleton rows={4} cols={5} />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Tasks Requiring Attention
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Action plans and remediation steps assigned to your department
                    </p>
                </div>

                <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-700 text-xs font-semibold self-start sm:self-auto">
                    Department: <span className="font-bold">{data.department?.name || "-"}</span>
                </div>
            </div>

            {/* SUMMARY TABS */}
            <div className="w-full">
                <TaskQueueTabs
                    summary={data.summary}
                    selectedQueue={selectedQueue}
                    onChange={(queue) => {
                        setSelectedQueue(queue);
                        fetchTasks(queue);
                    }}
                />
            </div>

            {/* TABLE / SKELETON / EMPTY */}
            {loading ? (
                <TableSkeleton rows={4} cols={5} />
            ) : data.tasks.length === 0 ? (
                <EmptyState
                    icon={CheckCircle2}
                    title="All caught up!"
                    description="No pending action plans in this queue. Great job keeping your department's audit findings resolved!"
                />
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="p-4">Finding Code</th>
                                    <th className="p-4">Finding Title</th>
                                    <th className="p-4">Root Cause</th>
                                    <th className="p-4">Workflow Queue</th>
                                    <th className="p-4">Target Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                                        onClick={() =>
                                            router.push(
                                                `/findings/${task.finding_id}?fd=${task.finding_department_id}&ap=${task.id}`
                                            )
                                        }
                                    >
                                        <td className="p-4 font-mono text-xs font-semibold text-blue-600">
                                            {task.finding_code}
                                        </td>
                                        <td className="p-4 font-semibold text-slate-900 max-w-xs">
                                            <div className="line-clamp-2">{task.title}</div>
                                        </td>
                                        <td className="p-4 text-slate-600 max-w-sm">
                                            <div className="line-clamp-2">{task.root_cause || "-"}</div>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${COLOR[task.queue]}`}
                                            >
                                                {LABEL[task.queue]}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-slate-600">
                                            {formatDate(task.due_date)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
