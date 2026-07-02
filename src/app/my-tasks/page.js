"use client";

import { formatDate } from "@/utils/date";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { getUser } from "@/utils/auth";

import TaskQueueTabs from "@/components/TaskQueueTabs";

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

    if (!data)
        return <p>Loading...</p>;

    return (
        <div className="p-8 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">
                    Task Requiring Attention
                </h1>

                <p className="text-slate-500">
                    Complete outstanding action plans assigned to your department.
                </p>

                <p className="text-sm text-slate-400">
                    Department : {data.department.name}
                </p>
            </div>

            {/* SUMMARY */}

            <div className="grid grid-cols-5 gap-4 mb-8">
                <TaskQueueTabs
                    summary={data.summary}
                    selectedQueue={selectedQueue}
                    onChange={(queue) => {
                        setSelectedQueue(queue);
                        fetchTasks(queue);
                    }}
                />
            </div>

            {/* TABLE */}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-4 text-left">Code Finding</th>
                            <th className="p-4 text-left">Finding</th>
                            <th className="p-4 text-left">Root Cause</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Target Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.tasks.map(task => (
                            <tr
                                key={task.id}
                                className="border-t border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => router.push(`/findings/${task.finding_id}?fd=${task.finding_department_id}&ap=${task.id}`)}

                            >
                                <td className="p-4">{task.finding_code}</td>
                                <td className="p-4">{task.title}</td>
                                <td className="p-4">{task.root_cause}</td>
                                <td className="p-4">{task.status}</td>
                                <td className="p-4">{formatDate(task.due_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
        </div>
    );
}

function FilterButton({
    children,
    active,
    onClick
}) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 rounded-lg border transition
                ${active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white hover:bg-slate-100"
                }
            `}
        >
            {children}
        </button>
    );
}