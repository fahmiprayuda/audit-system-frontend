"use client";

import { formatDate } from "@/utils/date";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { getUser } from "@/utils/auth";

export default function MyTasksPage() {

    const router = useRouter();
    const user = getUser();

    const [data, setData] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/my-tasks");

            setData(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (!data)
        return <p>Loading...</p>;

    return (
        <div className="p-8 space-y-6">

            <h1 className="text-3xl font-bold">
                Welcome, {user?.name}!!
            </h1>

            <p className="text-slate-500 mt-2">
                Department: {data.department.name}
            </p>

            {/* SUMMARY */}

            <div className="grid grid-cols-5 gap-4 mb-8">

                <Card
                    title="Total"
                    value={data.summary.total}
                />

                <Card
                    title="Draft"
                    value={data.summary.draft}
                />

                <Card
                    title="Submitted"
                    value={data.summary.submitted}
                />

                <Card
                    title="Need Revision"
                    value={data.summary.need_revision}
                />

                <Card
                    title="Approved"
                    value={data.summary.approved}
                />

            </div>

            {/* TABLE */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>
                            <th className="p-4 text-left">
                                Code Finding
                            </th>

                            <th className="p-4 text-left">
                                Finding
                            </th>

                            <th className="p-4 text-left">
                                Root Cause
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-left">
                                Target Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.tasks.map(task => (

                            <tr
                                key={task.id}
                                className="border-t border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => router.push(`/findings/${task.finding_id}?fd=${task.finding_department_id}`)}

                            >

                                <td className="p-4">
                                    {task.finding_code}
                                </td>

                                <td className="p-4">
                                    {task.title}
                                </td>

                                <td className="p-4">
                                    {task.root_cause}
                                </td>

                                <td className="p-4">
                                    {task.status}
                                </td>

                                <td className="p-4">
                                    {formatDate(task.target_date)}
                                </td>

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
            <p className="text-gray-500 text-sm">
                {title}
            </p>

            <h2 className="text-3xl font-bold">
                {value}
            </h2>
        </div>
    );
}