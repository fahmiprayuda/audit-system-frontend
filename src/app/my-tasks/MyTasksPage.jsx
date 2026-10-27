"use client";

import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { getUser } from "@/utils/auth";

import WorkflowBadge from "@/components/badges/WorkflowBadge";
import RiskBadge from "@/components/badges/RiskBadge";
import TaskQueueTabs from "@/components/TaskQueueTabs";
import TableSkeleton from "@/components/ui/TableSkeleton";
import EmptyState from "@/components/ui/EmptyState";

import {
    Building2,
    Users2,
    Search,
    X,
    Filter,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    FilePlus2,
    ShieldCheck,
    Target,
    ArrowUpRight,
    ListTodo,
    ChevronRight,
    AlertCircle,
    RotateCcw
} from "lucide-react";

export default function MyTasksPage() {
    const router = useRouter();
    const user = getUser();

    const [data, setData] = useState(null);
    const [selectedQueue, setSelectedQueue] = useState("all");
    const [loading, setLoading] = useState(false);

    // Filter & Search states
    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");

    const fetchTasks = async (queue = "all") => {
        try {
            setLoading(true);

            const url = queue === "all" ? "/my-tasks" : `/my-tasks?queue=${queue}`;
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

    // Filtered tasks based on search & risk filter
    const filteredTasks = useMemo(() => {
        if (!data?.tasks) return [];
        return data.tasks.filter((task) => {
            const query = search.trim().toLowerCase();
            const matchesSearch =
                !query ||
                task.finding_code?.toLowerCase().includes(query) ||
                task.title?.toLowerCase().includes(query) ||
                task.root_cause?.toLowerCase().includes(query) ||
                task.corrective_action?.toLowerCase().includes(query) ||
                task.project_name?.toLowerCase().includes(query) ||
                task.project_code?.toLowerCase().includes(query);

            const matchesRisk =
                riskFilter === "all" || task.risk_rating === riskFilter;

            return matchesSearch && matchesRisk;
        });
    }, [data?.tasks, search, riskFilter]);

    // Calculate urgency status for due date
    const getDueStatus = (dueDateStr) => {
        if (!dueDateStr) return null;
        try {
            const due = new Date(dueDateStr);
            const now = new Date();
            due.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);
            const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                return {
                    label: `${Math.abs(diffDays)}d overdue`,
                    color: "text-rose-600 bg-rose-50 border-rose-200",
                    isOverdue: true,
                };
            } else if (diffDays === 0) {
                return {
                    label: "Due today",
                    color: "text-amber-700 bg-amber-50 border-amber-200",
                    isSoon: true,
                };
            } else if (diffDays <= 7) {
                return {
                    label: `Due in ${diffDays}d`,
                    color: "text-amber-600 bg-amber-50/60 border-amber-200/60",
                    isSoon: true,
                };
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    if (!data) {
        return (
            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
                        <div className="h-4 w-96 bg-slate-200 rounded-xl animate-pulse" />
                    </div>
                    <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse hidden sm:block" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
                <TableSkeleton rows={4} cols={5} />
            </div>
        );
    }

    const summary = data.summary || {};
    const needsActionCount = (summary.new || 0) + (summary.revision || 0);
    const inReviewCount = (summary.waiting || 0) + (summary.site || 0);
    const overdueCount = summary.overdue || 0;

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            {/* TOP HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        <span>Auditee Workspace</span>
                        <span>•</span>
                        <span>Action Plan Remediation</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Tasks Requiring Attention
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Action plans and remediation steps assigned to your department
                    </p>
                </div>

                {/* COMPANY & DEPARTMENT BADGES */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition">
                        <Building2 size={15} className="text-slate-500 shrink-0" />
                        <span className="text-slate-500 font-medium">Company:</span>
                        <span className="text-slate-900 font-bold">
                            {data.company?.name || user?.department?.company?.name || "Corporate"}
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50/70 hover:bg-blue-50 border border-blue-200/80 rounded-xl text-xs font-semibold text-blue-700 shadow-sm transition">
                        <Users2 size={15} className="text-blue-500 shrink-0" />
                        <span className="text-blue-600 font-medium">Department:</span>
                        <span className="text-blue-950 font-bold">
                            {data.department?.name || user?.department?.name || "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* QUICK STATS METRIC CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Tasks */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedQueue("all");
                        fetchTasks("all");
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        selectedQueue === "all"
                            ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedQueue === "all" ? "text-slate-300" : "text-slate-500"}`}>
                            Total Assigned
                        </span>
                        <div className={`p-2 rounded-xl ${selectedQueue === "all" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>
                            <ListTodo size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black">
                        {summary.all ?? 0}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${selectedQueue === "all" ? "text-slate-300" : "text-slate-500"}`}>
                        All active action plans
                    </div>
                </button>

                {/* Needs Action */}
                <button
                    type="button"
                    onClick={() => {
                        const target = summary.new > 0 ? "new" : "revision";
                        setSelectedQueue(target);
                        fetchTasks(target);
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        selectedQueue === "new" || selectedQueue === "revision"
                            ? "bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/10"
                            : "bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedQueue === "new" || selectedQueue === "revision" ? "text-amber-100" : "text-amber-700"}`}>
                            Action Required
                        </span>
                        <div className={`p-2 rounded-xl ${selectedQueue === "new" || selectedQueue === "revision" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                            <FilePlus2 size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black">
                        {needsActionCount}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${selectedQueue === "new" || selectedQueue === "revision" ? "text-amber-100" : "text-slate-500"}`}>
                        {summary.new || 0} New • {summary.revision || 0} Revision
                    </div>
                </button>

                {/* Under Review */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedQueue("waiting");
                        fetchTasks("waiting");
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        selectedQueue === "waiting" || selectedQueue === "site"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/10"
                            : "bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedQueue === "waiting" || selectedQueue === "site" ? "text-indigo-200" : "text-indigo-700"}`}>
                            Audit Review
                        </span>
                        <div className={`p-2 rounded-xl ${selectedQueue === "waiting" || selectedQueue === "site" ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black">
                        {inReviewCount}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${selectedQueue === "waiting" || selectedQueue === "site" ? "text-indigo-200" : "text-slate-500"}`}>
                        {summary.waiting || 0} Waiting • {summary.site || 0} Site
                    </div>
                </button>

                {/* Overdue */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedQueue("overdue");
                        fetchTasks("overdue");
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        selectedQueue === "overdue"
                            ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-600/10"
                            : overdueCount > 0
                            ? "bg-rose-50/50 border-rose-200 hover:border-rose-300 hover:shadow-sm"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedQueue === "overdue" ? "text-rose-100" : overdueCount > 0 ? "text-rose-700 font-extrabold" : "text-slate-500"}`}>
                            Overdue Actions
                        </span>
                        <div className={`p-2 rounded-xl ${selectedQueue === "overdue" ? "bg-white/20 text-white" : overdueCount > 0 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className={`mt-2 text-2xl font-black ${selectedQueue === "overdue" ? "text-white" : overdueCount > 0 ? "text-rose-600" : "text-slate-900"}`}>
                        {overdueCount}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${selectedQueue === "overdue" ? "text-rose-100" : overdueCount > 0 ? "text-rose-600 font-semibold" : "text-slate-500"}`}>
                        {overdueCount > 0 ? "Requires urgent remediation" : "No overdue items"}
                    </div>
                </button>
            </div>

            {/* QUEUE TABS */}
            <div className="w-full">
                <TaskQueueTabs
                    summary={summary}
                    selectedQueue={selectedQueue}
                    onChange={(queue) => {
                        setSelectedQueue(queue);
                        fetchTasks(queue);
                    }}
                />
            </div>

            {/* SEARCH & RISK FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                {/* Search Box */}
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by code, title, root cause, corrective action..."
                        className="w-full pl-10 pr-9 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Risk Filter & Counter */}
                <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                        <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                            className="text-xs font-semibold pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition cursor-pointer appearance-none"
                        >
                            <option value="all">All Risk Levels</option>
                            <option value="Extreme">Extreme Risk</option>
                            <option value="Major">Major Risk</option>
                            <option value="Moderate">Moderate Risk</option>
                            <option value="Low">Low Risk</option>
                        </select>
                        <Filter
                            size={12}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </div>

                    {(search || riskFilter !== "all") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setRiskFilter("all");
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Reset filters"
                        >
                            <RotateCcw size={13} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}

                    <div className="text-xs font-semibold text-slate-500 whitespace-nowrap pl-1">
                        Showing <span className="text-slate-900 font-bold">{filteredTasks.length}</span> of {data.tasks.length}
                    </div>
                </div>
            </div>

            {/* TABLE / CARDS / SKELETON / EMPTY STATE */}
            {loading ? (
                <TableSkeleton rows={4} cols={5} />
            ) : filteredTasks.length === 0 ? (
                <EmptyState
                    icon={search || riskFilter !== "all" ? Search : CheckCircle2}
                    title={search || riskFilter !== "all" ? "No matching tasks found" : "All caught up!"}
                    description={
                        search || riskFilter !== "all"
                            ? "Try adjusting your search query or reset the risk level filter."
                            : "No pending action plans in this queue. Great job keeping your department's audit findings resolved!"
                    }
                />
            ) : (
                <div className="space-y-4">
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="py-4 px-5">Finding & Risk</th>
                                        <th className="py-4 px-5">Remediation Action Plan</th>
                                        <th className="py-4 px-5">Workflow Stage</th>
                                        <th className="py-4 px-5">Target Due Date</th>
                                        <th className="py-4 px-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTasks.map((task) => {
                                        const dueStatus = getDueStatus(task.due_date);
                                        const destination = `/findings/${task.finding_id}?fd=${task.finding_department_id}&ap=${task.id}`;

                                        return (
                                            <tr
                                                key={task.id}
                                                onClick={() => router.push(destination)}
                                                className="group hover:bg-slate-50/70 cursor-pointer transition-colors duration-150"
                                            >
                                                {/* Finding Code & Risk */}
                                                <td className="py-4 px-5 align-top">
                                                    <div className="space-y-1.5">
                                                        <div className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700 transition">
                                                            {task.finding_code}
                                                        </div>
                                                        <div>
                                                            <RiskBadge risk={task.risk_rating || "Moderate"} />
                                                        </div>
                                                        {task.project_name && (
                                                            <div className="text-[11px] text-slate-400 line-clamp-1">
                                                                {task.project_name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Title & Remediation details */}
                                                <td className="py-4 px-5 align-top max-w-md">
                                                    <div className="space-y-2">
                                                        <div className="font-semibold text-slate-900 group-hover:text-blue-900 line-clamp-2 transition leading-snug">
                                                            {task.title}
                                                        </div>

                                                        {/* Corrective Action Box */}
                                                        {task.corrective_action && (
                                                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                                    <Target size={12} className="text-blue-600" />
                                                                    <span>Action Plan</span>
                                                                </div>
                                                                <div className="line-clamp-2 leading-relaxed">
                                                                    {task.corrective_action}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Root Cause snippet */}
                                                        {task.root_cause && (
                                                            <div className="text-xs text-slate-500 line-clamp-1">
                                                                <span className="font-medium text-slate-600">Root cause:</span> {task.root_cause}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Workflow Badge */}
                                                <td className="py-4 px-5 align-top whitespace-nowrap">
                                                    <WorkflowBadge queue={task.queue} />
                                                </td>

                                                {/* Target Due Date & Status */}
                                                <td className="py-4 px-5 align-top whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                                            <Calendar size={13} className="text-slate-400 shrink-0" />
                                                            <span>{formatDate(task.due_date)}</span>
                                                        </div>
                                                        {dueStatus && (
                                                            <div>
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${dueStatus.color}`}>
                                                                    {dueStatus.isOverdue && <AlertCircle size={10} />}
                                                                    {dueStatus.label}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Action Button */}
                                                <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-all shadow-sm">
                                                        <span>Respond</span>
                                                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="md:hidden space-y-3">
                        {filteredTasks.map((task) => {
                            const dueStatus = getDueStatus(task.due_date);
                            const destination = `/findings/${task.finding_id}?fd=${task.finding_department_id}&ap=${task.id}`;

                            return (
                                <div
                                    key={task.id}
                                    onClick={() => router.push(destination)}
                                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition cursor-pointer space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <span className="font-mono text-xs font-bold text-blue-600">
                                                {task.finding_code}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <RiskBadge risk={task.risk_rating || "Moderate"} />
                                                <WorkflowBadge queue={task.queue} />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-slate-600">
                                                {formatDate(task.due_date)}
                                            </div>
                                            {dueStatus && (
                                                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${dueStatus.color}`}>
                                                    {dueStatus.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900 text-sm">
                                            {task.title}
                                        </h3>
                                        {task.corrective_action && (
                                            <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                                                    Action Plan
                                                </div>
                                                <div className="line-clamp-2">
                                                    {task.corrective_action}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="text-slate-500">
                                            {task.project_name || "Annual Audit"}
                                        </span>
                                        <span className="font-bold text-blue-600 flex items-center gap-1">
                                            <span>Open Action Plan</span>
                                            <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
