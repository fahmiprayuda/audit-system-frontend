"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { sub } from "framer-motion/client";

export default function AuditTrailPage() {

    const actionColor = {
        create:
            "bg-green-100 text-green-700",

        update:
            "bg-yellow-100 text-yellow-700",

        delete:
            "bg-red-100 text-red-700",

        approve:
            "bg-blue-100 text-blue-700",

        submit:
            "bg-purple-100 text-purple-700",

        comment:
            "bg-gray-100 text-gray-700",
    };

    const [loading, setLoading] =
        useState(false);

    const [logs, setLogs] = useState([]);

    const [filters, setFilters] = useState({
        module: "",
        action: "",
        search: "",
        page: 1,
    });

    const loadData = async () => {

        try {

            setLoading(true);

            const res = await api.get(
                "/audit-trails",
                {
                    params: filters,
                }
            );

            setLogs(res.data.data);

            setPagination({
                current: res.data.current_page,
                last: res.data.last_page,
                total: res.data.total,
            });

        } finally {

            setLoading(false);

        }
    };

    const [pagination, setPagination] =
        useState({
            current: 1,
            last: 1,
            total: 0,
        });

    useEffect(() => {
        loadData();
    }, [filters]);



    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Audit Trail
            </h1>

            <div className="flex gap-3 mb-6">

                <input
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            search: e.target.value,
                            page: 1,
                        })
                    }
                    className="border rounded-lg px-3 py-2"
                />

                <select
                    value={filters.module}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            module: e.target.value,
                            page: 1,
                        })
                    }
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">
                        All Modules
                    </option>

                    <option value="finding">
                        Finding
                    </option>

                    <option value="action_plan">
                        Action Plan
                    </option>

                    <option value="comment">
                        Comment
                    </option>

                </select>

                <select
                    value={filters.action}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            action: e.target.value,
                            page: 1,
                        })
                    }
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">
                        All Actions
                    </option>

                    <option value="CREATE">
                        CREATE
                    </option>

                    <option value="UPDATE">
                        UPDATE
                    </option>

                    <option value="SUBMIT">
                        SUBMIT
                    </option>

                    <option value="APPROVE">
                        APPROVE
                    </option>

                    <option value="COMMENT">
                        COMMENT
                    </option>

                </select>

            </div>

            <div className="bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left p-3">
                                Date
                            </th>

                            <th className="text-left p-3">
                                User
                            </th>

                            <th className="text-left p-3">
                                Module
                            </th>

                            <th className="text-left p-3">
                                Action
                            </th>

                            <th className="text-left p-3">
                                Description
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                        {logs.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-10 text-gray-500">
                                    No audit trail found
                                </td>
                            </tr>
                        )}

                        {logs.map((log) => (

                            <tr
                                key={log.id}
                                className="border-t"
                            >

                                <td className="p-3">
                                    {new Date(
                                        log.created_at
                                    ).toLocaleString()}
                                </td>

                                <td className="p-3">
                                    {log.user?.name || "-"}
                                </td>

                                <td className="p-3">
                                    {log.module}
                                </td>

                                <td className="p-3">

                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${actionColor[log.action] || "bg-gray-100 text-gray-700"}`}>
                                        {log.action}
                                    </span>

                                </td>

                                <td className="p-3">
                                    {log.description}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
            <div className="flex justify-between mt-6">

                <p>
                    Total: {pagination.total}
                </p>

                <div className="flex gap-2">

                    <button className="border px-3 py-1 rounded-lg disabled:opacity-50"
                        disabled={
                            pagination.current === 1
                        }
                        onClick={() =>
                            setFilters({
                                ...filters,
                                page:
                                    pagination.current - 1,
                            })
                        }
                    >
                        Prev
                    </button>

                    <span>
                        {pagination.current}
                        /
                        {pagination.last}
                    </span>

                    <button className="border px-3 py-1 rounded-lg disabled:opacity-50"
                        disabled={
                            pagination.current ===
                            pagination.last
                        }
                        onClick={() =>
                            setFilters({
                                ...filters,
                                page:
                                    pagination.current + 1,
                            })
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}