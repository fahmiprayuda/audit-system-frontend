"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/badges/StatusBadge";
import RiskBadge from "@/components/badges/RiskBadge";
import TableSkeleton from "@/components/ui/TableSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Search, RotateCcw, FileSearch } from "lucide-react";

export default function FindingsPage() {

    const router = useRouter();

    const [findings, setFindings] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [risk, setRisk] = useState("");
    const [department, setDepartment] = useState("");
    const [page, setPage] = useState(1);

    // ================= FETCH DEPARTMENTS =================
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await api.get("/departments");
                setDepartments(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDepartments();
    }, []);

    // ================= FETCH FINDINGS =================
    useEffect(() => {

        const fetchFindings = async () => {
            try {
                setLoading(true);

                const res = await api.get("/findings", {
                    params: {
                        search,
                        risk_rating: risk,
                        department_id: department,
                        page
                    }
                });

                setFindings(res?.data?.data || []);
                setPagination(res.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFindings();

    }, [search, risk, department, page]);

    const resetFilters = () => {
        setSearch("");
        setSearchInput("");
        setRisk("");
        setDepartment("");
        setPage(1);
    };

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Audit Findings
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Track and review audit findings, risk ratings & action plan fulfillment
                        </p>
                    </div>

                    {pagination && (
                        <div className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm self-start sm:self-auto">
                            Total Findings: <span className="text-blue-600 font-bold">{pagination.total || 0}</span>
                        </div>
                    )}
                </div>

                {/* ================= FILTER ================= */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex gap-3 items-center flex-wrap">
                    {/* SEARCH */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search finding code or title..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setSearch(searchInput);
                                    setPage(1);
                                }
                            }}
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setSearch(searchInput);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
                    >
                        Search
                    </button>

                    {/* RISK */}
                    <select
                        value={risk}
                        onChange={(e) => {
                            setRisk(e.target.value);
                            setPage(1);
                        }}
                        className="text-sm border border-slate-200 px-3 py-2 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Risks</option>
                        <option value="Extreme">Extreme</option>
                        <option value="Major">Major</option>
                        <option value="Moderate">Moderate</option>
                    </select>

                    {/* DEPARTMENT */}
                    <select
                        value={department}
                        onChange={(e) => {
                            setDepartment(e.target.value);
                            setPage(1);
                        }}
                        className="text-sm border border-slate-200 px-3 py-2 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    {/* RESET */}
                    {(search || risk || department) && (
                        <button
                            onClick={resetFilters}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>

                {/* ================= TABLE / SKELETON / EMPTY STATE ================= */}
                {loading ? (
                    <TableSkeleton rows={5} cols={6} />
                ) : findings.length === 0 ? (
                    <EmptyState
                        icon={FileSearch}
                        title="No findings matched"
                        description="Try adjusting your search criteria, risk classification, or department filter."
                        actionLabel="Clear Filters"
                        onAction={resetFilters}
                    />
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="p-4">Project</th>
                                        <th className="p-4">Code</th>
                                        <th className="p-4">Finding Title</th>
                                        <th className="p-4">Department</th>
                                        <th className="p-4">Risk Rating</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {findings.map((finding) => (
                                        <tr
                                            key={finding.id}
                                            onClick={() => router.push(`/findings/${finding.id}`)}
                                            className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                                        >
                                            <td className="p-4 font-semibold text-blue-600">
                                                {finding.project?.project_code || "-"}
                                            </td>

                                            <td className="p-4 font-mono text-xs font-semibold text-slate-800">
                                                {finding.finding_code}
                                            </td>

                                            <td className="p-4 font-medium text-slate-900 max-w-md">
                                                <div className="line-clamp-2">{finding.title}</div>
                                            </td>

                                            {/* DEPARTMENTS */}
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {finding.departments?.length > 0 ? (
                                                        finding.departments.map((dept, i) => (
                                                            <span
                                                                key={i}
                                                                className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-medium"
                                                            >
                                                                {dept.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* RISK */}
                                            <td className="p-4">
                                                <RiskBadge risk={finding.risk_rating} />
                                            </td>

                                            {/* STATUS */}
                                            <td className="p-4">
                                                <StatusBadge status={finding.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            {/* ================= PAGINATION ================= */}

            {pagination && (
                <div className="flex justify-center items-center gap-4 mt-8">

                    <button
                        disabled={!pagination.prev_page_url}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <span className="font-medium">
                        Page {pagination.current_page} / {pagination.last_page}
                    </span>

                    <button
                        disabled={!pagination.next_page_url}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>
            )}
            </div>
        </div>
    );
}


/* ================= DATE ================= */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}