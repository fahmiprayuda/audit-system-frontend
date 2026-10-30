"use client";

import { useEffect, useState, useCallback, forwardRef } from "react";
import api from "@/lib/axios";
import { formatDateTime, timeAgo, formatDateForApi, formatDate } from "@/utils/date";
import { exportToCsv } from "@/utils/exportCsv";
import TableSkeleton from "@/components/ui/TableSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    History,
    Search,
    X,
    RotateCcw,
    Download,
    Eye,
    Clock,
    FolderKanban,
    AlertCircle,
    ListTodo,
    MessageSquare,
    PlusCircle,
    FileEdit,
    CheckCircle2,
    GitCommit,
    CalendarClock,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowRight,
    ExternalLink,
    FileText,
    ArrowUpRight,
    Calendar,
    CalendarDays,
    ChevronDown,
    Globe,
    Filter,
    Loader2,
} from "lucide-react";

// Helper: Normalize string
const normalize = (str) => (str ? String(str).toLowerCase().trim() : "");

// Action badge styling & meta
function getActionMeta(action) {
    const act = normalize(action);

    if (act === "create") {
        return {
            label: "Created",
            icon: PlusCircle,
            badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10",
            dotClass: "bg-emerald-500",
        };
    }
    if (act === "update") {
        return {
            label: "Updated",
            icon: FileEdit,
            badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10",
            dotClass: "bg-amber-500",
        };
    }
    if (act === "delete") {
        return {
            label: "Deleted",
            icon: Trash2,
            badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10",
            dotClass: "bg-rose-500",
        };
    }
    if (act === "close" || act === "approve") {
        return {
            label: "Closed",
            icon: CheckCircle2,
            badgeClass: "bg-teal-50 text-teal-700 border-teal-200/80 ring-teal-500/10",
            dotClass: "bg-teal-500",
        };
    }
    if (act === "workflow_changed" || act === "submit") {
        return {
            label: "Workflow",
            icon: GitCommit,
            badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10",
            dotClass: "bg-blue-500",
        };
    }
    if (act === "extend") {
        return {
            label: "Extended",
            icon: CalendarClock,
            badgeClass: "bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10",
            dotClass: "bg-purple-500",
        };
    }
    if (act === "comment") {
        return {
            label: "Comment",
            icon: MessageSquare,
            badgeClass: "bg-slate-100 text-slate-700 border-slate-200/80 ring-slate-500/10",
            dotClass: "bg-slate-500",
        };
    }

    return {
        label: action || "Event",
        icon: FileText,
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200/80 ring-slate-500/10",
        dotClass: "bg-slate-400",
    };
}

// Module badge styling & meta
function getModuleMeta(module) {
    const mod = normalize(module);

    if (mod === "project") {
        return {
            label: "Project",
            icon: FolderKanban,
            badgeClass: "bg-sky-50 text-sky-700 border-sky-200/80",
        };
    }
    if (mod === "finding") {
        return {
            label: "Finding",
            icon: AlertCircle,
            badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
        };
    }
    if (mod === "action_plan" || mod === "actionplan") {
        return {
            label: "Action Plan",
            icon: ListTodo,
            badgeClass: "bg-purple-50 text-purple-700 border-purple-200/80",
        };
    }
    if (mod === "comment") {
        return {
            label: "Comment",
            icon: MessageSquare,
            badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        };
    }

    return {
        label: module ? module.charAt(0).toUpperCase() + module.slice(1) : "System",
        icon: FileText,
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200/80",
    };
}

// Avatar color helper based on name
function getAvatarBg(name = "") {
    const colors = [
        "bg-blue-600",
        "bg-emerald-600",
        "bg-purple-600",
        "bg-amber-600",
        "bg-indigo-600",
        "bg-rose-600",
        "bg-teal-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// Format human-friendly field name
function formatFieldName(key = "") {
    const map = {
        project_code: "Project Code",
        project_name: "Project Name",
        finding_code: "Finding Code",
        risk_rating: "Risk Rating",
        risk_category: "Risk Category",
        audit_type: "Audit Type",
        release_date: "Release Date",
        due_date: "Due Date",
        status: "Status",
        workflow_status: "Workflow Status",
        workflow_action: "Workflow Action",
        company_id: "Company ID",
        created_by: "Created By",
        closed_by: "Closed By",
        closed_at: "Closed At",
        action_plan: "Action Plan Task",
        corrective_action: "Corrective Action",
        root_cause: "Root Cause",
        lead_auditor: "Lead Auditor",
        comment: "Comment Message",
        message: "Message",
    };
    return map[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Format field value for display in details
function formatValueDisplay(v, key = "") {
    if (v === null || v === undefined || v === "") {
        return <span className="text-slate-300 italic">—</span>;
    }
    if (typeof v === "boolean") {
        return (
            <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                    v ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
            >
                {v ? "Yes" : "No"}
            </span>
        );
    }
    if (typeof v === "object") {
        if (v && v.name) return String(v.name);
        if (Array.isArray(v)) {
            if (v.length === 0) return <span className="text-slate-300 italic">Empty</span>;
            return (
                <div className="flex flex-wrap gap-1">
                    {v.map((item, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                            {typeof item === "object" ? JSON.stringify(item) : String(item)}
                        </span>
                    ))}
                </div>
            );
        }
        return <span className="font-mono text-xs">{JSON.stringify(v)}</span>;
    }

    const str = String(v);

    // If date format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return <span>{formatDate(str)}</span>;
    }

    // If status
    if (key.toLowerCase().includes("status")) {
        const isClosed = str.toLowerCase() === "closed";
        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    isClosed
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
            >
                {str.replace(/_/g, " ")}
            </span>
        );
    }

    // If code like AUD-... or FND-...
    if (/^[A-Z]{2,4}-[A-Z0-9-]+$/.test(str)) {
        return (
            <span className="font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200 text-xs">
                {str}
            </span>
        );
    }

    return <span>{str}</span>;
}

// Helper: get month range { from: 'YYYY-MM-01', to: 'YYYY-MM-lastDay' }
function getMonthRange(year, month) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
        from: formatDateForApi(start),
        to: formatDateForApi(end),
    };
}

// Helper: list of available months for "Pilih Bulan Tertentu" (last 18 months)
function getRecentMonths(count = 18) {
    const list = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        const key = `${y}-${String(m + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
        list.push({ key, label, year: y, month: m });
    }
    return list;
}

// Custom Button Trigger for react-datepicker Range
const CustomDateRangeInput = forwardRef(({ value, onClick }, ref) => (
    <button
        type="button"
        onClick={onClick}
        ref={ref}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
        title="Click to open calendar range picker"
    >
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span>{value || "Select Date Range"}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
    </button>
));
CustomDateRangeInput.displayName = "CustomDateRangeInput";

export default function AuditTrailPage() {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    // Recent months reference
    const availableMonths = getRecentMonths(18);

    // Filters state
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [allPeriodsSearch, setAllPeriodsSearch] = useState(false);
    const [moduleFilter, setModuleFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");

    // Period state (Opsi B: default current month)
    const initialRange = getMonthRange(new Date().getFullYear(), new Date().getMonth());
    const [periodType, setPeriodType] = useState("current_month"); // "current_month" | "previous_month" | "select_month" | "custom_range"
    const [selectedMonthKey, setSelectedMonthKey] = useState(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
    );
    const [dateFrom, setDateFrom] = useState(initialRange.from);
    const [dateTo, setDateTo] = useState(initialRange.to);
    const [rangeStart, setRangeStart] = useState(
        initialRange.from ? new Date(`${initialRange.from}T00:00:00`) : null
    );
    const [rangeEnd, setRangeEnd] = useState(
        initialRange.to ? new Date(`${initialRange.to}T00:00:00`) : null
    );
    const [perPage, setPerPage] = useState(20);
    const [page, setPage] = useState(1);

    // Selected log for inspection modal
    const [inspectLog, setInspectLog] = useState(null);

    // Pagination metadata
    const [pagination, setPagination] = useState({
        current: 1,
        last: 1,
        total: 0,
        from: 0,
        to: 0,
    });

    // Debounce search input (350ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 350);
        return () => clearTimeout(timer);
    }, [search]);

    // Automatically uncheck allPeriodsSearch if search query is emptied
    useEffect(() => {
        if (!search.trim() && allPeriodsSearch) {
            setAllPeriodsSearch(false);
            setPage(1);
        }
    }, [search, allPeriodsSearch]);

    // Handle Period Type change
    const handlePeriodTypeChange = (newType) => {
        setPeriodType(newType);
        setPage(1);
        const now = new Date();

        if (newType === "current_month") {
            const range = getMonthRange(now.getFullYear(), now.getMonth());
            setDateFrom(range.from);
            setDateTo(range.to);
            setRangeStart(new Date(`${range.from}T00:00:00`));
            setRangeEnd(new Date(`${range.to}T00:00:00`));
        } else if (newType === "previous_month") {
            const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const range = getMonthRange(prev.getFullYear(), prev.getMonth());
            setDateFrom(range.from);
            setDateTo(range.to);
            setRangeStart(new Date(`${range.from}T00:00:00`));
            setRangeEnd(new Date(`${range.to}T00:00:00`));
        } else if (newType === "select_month") {
            const [yStr, mStr] = selectedMonthKey.split("-");
            const range = getMonthRange(parseInt(yStr, 10), parseInt(mStr, 10) - 1);
            setDateFrom(range.from);
            setDateTo(range.to);
            setRangeStart(new Date(`${range.from}T00:00:00`));
            setRangeEnd(new Date(`${range.to}T00:00:00`));
        } else if (newType === "custom_range") {
            if (!dateFrom || !dateTo) {
                const range = getMonthRange(now.getFullYear(), now.getMonth());
                setDateFrom(range.from);
                setDateTo(range.to);
                setRangeStart(new Date(`${range.from}T00:00:00`));
                setRangeEnd(new Date(`${range.to}T00:00:00`));
            } else {
                setRangeStart(new Date(`${dateFrom}T00:00:00`));
                setRangeEnd(new Date(`${dateTo}T00:00:00`));
            }
        }
    };

    // Handle Month Selection from dropdown
    const handleSpecificMonthChange = (monthKey) => {
        setSelectedMonthKey(monthKey);
        setPage(1);
        const [yStr, mStr] = monthKey.split("-");
        const range = getMonthRange(parseInt(yStr, 10), parseInt(mStr, 10) - 1);
        setDateFrom(range.from);
        setDateTo(range.to);
        setRangeStart(new Date(`${range.from}T00:00:00`));
        setRangeEnd(new Date(`${range.to}T00:00:00`));
    };

    // Handle Custom Range selection with 2-calendar DatePicker & strict 31-day max guardrail
    const handleCustomRangeChange = (update) => {
        if (!update) {
            setRangeStart(null);
            setRangeEnd(null);
            return;
        }
        let [start, end] = update;

        if (start && end && end < start) {
            const temp = start;
            start = end;
            end = temp;
        }

        setRangeStart(start);
        setRangeEnd(end);

        if (start && end) {
            const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            let finalEnd = end;
            if (diffDays > 31) {
                // Auto clamp end date to exactly 30 days from start (31 days total)
                finalEnd = new Date(start);
                finalEnd.setDate(finalEnd.getDate() + 30);
                setRangeEnd(finalEnd);
            }
            setDateFrom(formatDateForApi(start));
            setDateTo(formatDateForApi(finalEnd));
            setPage(1);
        }
    };

    // Load audit trail data
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page,
                per_page: perPage,
            };

            if (debouncedSearch.trim()) {
                params.search = debouncedSearch.trim();
                if (allPeriodsSearch) {
                    params.all_periods = 1;
                }
            }

            // Only send period when not in global all-periods search mode
            if (!allPeriodsSearch || !debouncedSearch.trim()) {
                if (dateFrom) params.date_from = dateFrom;
                if (dateTo) params.date_to = dateTo;
            }

            if (moduleFilter) params.module = moduleFilter;
            if (actionFilter) params.action = actionFilter;

            const res = await api.get("/audit-trails", { params });
            const data = res.data;

            setLogs(data.data || []);
            setPagination({
                current: data.current_page || 1,
                last: data.last_page || 1,
                total: data.total || 0,
                from: data.from || 0,
                to: data.to || 0,
            });
        } catch (err) {
            console.error("Failed to fetch audit trails:", err);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, debouncedSearch, allPeriodsSearch, moduleFilter, actionFilter, dateFrom, dateTo]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Reset filters
    const handleResetFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setAllPeriodsSearch(false);
        setModuleFilter("");
        setActionFilter("");
        setPeriodType("current_month");
        const currentRange = getMonthRange(new Date().getFullYear(), new Date().getMonth());
        setDateFrom(currentRange.from);
        setDateTo(currentRange.to);
        setRangeStart(new Date(`${currentRange.from}T00:00:00`));
        setRangeEnd(new Date(`${currentRange.to}T00:00:00`));
        setSelectedMonthKey(
            `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
        );
        setPage(1);
    };

    const isCurrentMonthDefault =
        periodType === "current_month" &&
        dateFrom === initialRange.from &&
        dateTo === initialRange.to;

    const hasActiveFilters = Boolean(
        search ||
        moduleFilter ||
        actionFilter ||
        !isCurrentMonthDefault ||
        allPeriodsSearch
    );

    // Export current page or all records in active period to CSV
    const handleExportCsv = async () => {
        if (!logs.length && pagination.total === 0) return alert("No logs available to export");

        try {
            setIsExporting(true);
            let exportData = logs;

            // If there are more records than currently visible on page 1, fetch all for this period
            if (pagination.total > logs.length) {
                const params = {
                    per_page: Math.min(pagination.total, 1000),
                };
                if (debouncedSearch.trim()) {
                    params.search = debouncedSearch.trim();
                    if (allPeriodsSearch) params.all_periods = 1;
                }
                if (!allPeriodsSearch || !debouncedSearch.trim()) {
                    if (dateFrom) params.date_from = dateFrom;
                    if (dateTo) params.date_to = dateTo;
                }
                if (moduleFilter) params.module = moduleFilter;
                if (actionFilter) params.action = actionFilter;

                const res = await api.get("/audit-trails", { params });
                exportData = res.data?.data || logs;
            }

            const columns = [
                { key: "id", label: "LOG ID" },
                {
                    key: "created_at",
                    label: "TIMESTAMP",
                    format: (val) => formatDateTime(val),
                },
                {
                    key: "user",
                    label: "ACTOR NAME",
                    format: (val, row) => row.user?.name || "System",
                },
                {
                    key: "user_role",
                    label: "ACTOR ROLE",
                    format: (_, row) => row.user?.role || "-",
                },
                {
                    key: "module",
                    label: "MODULE",
                    format: (val) => String(val).toUpperCase(),
                },
                {
                    key: "action",
                    label: "ACTION",
                    format: (val) => String(val).toUpperCase(),
                },
                {
                    key: "project_code",
                    label: "PROJECT CODE",
                    format: (val, row) => row.project_code || "-",
                },
                {
                    key: "finding_code",
                    label: "FINDING CODE",
                    format: (val, row) => row.finding_code || "-",
                },
                { key: "description", label: "DESCRIPTION" },
            ];

            // Build period-reflective filename
            let filename = "audit-trail";
            if (allPeriodsSearch && debouncedSearch) {
                filename += `-all-periods-${debouncedSearch.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`;
            } else if (dateFrom && dateTo) {
                if (dateFrom.slice(0, 7) === dateTo.slice(0, 7) && dateFrom.endsWith("-01")) {
                    filename += `-${dateFrom.slice(0, 7)}`;
                } else {
                    filename += `-${dateFrom}_sd_${dateTo}`;
                }
            } else {
                filename += `-${new Date().toISOString().slice(0, 10)}`;
            }
            filename += ".csv";

            exportToCsv(exportData, filename, columns);
        } catch (err) {
            console.error("Failed to export audit trail CSV:", err);
            alert("Gagal melakukan export CSV. Silakan coba beberapa saat lagi.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* PAGE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-sm shadow-slate-200">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    System Audit Trail
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                                    {pagination.total} Records
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Immutable event feed with linked Project & Finding context codes
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            disabled={logs.length === 0 || isExporting}
                            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                            title="Export filtered records as CSV"
                        >
                            {isExporting ? (
                                <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 text-slate-500" />
                            )}
                            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl shadow-xs transition cursor-pointer"
                            title="Refresh data"
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* FILTER CONTROLS BAR */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
                    {/* Top Row: Search, Module, Action, Reset */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        {/* Search Input & All-Periods Toggle */}
                        <div className="md:col-span-5 space-y-1.5">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by Project (AUD-...), Finding (FND-...), Actor, or Action..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {search.trim().length > 0 && (
                                <div className="flex items-center gap-2 px-1">
                                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-700 cursor-pointer select-none hover:bg-blue-100/70 transition">
                                        <input
                                            type="checkbox"
                                            checked={allPeriodsSearch}
                                            onChange={(e) => {
                                                setAllPeriodsSearch(e.target.checked);
                                                setPage(1);
                                            }}
                                            className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Search Across All Periods</span>
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        (bypasses month limit)
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Module Dropdown */}
                        <div className="md:col-span-3">
                            <select
                                value={moduleFilter}
                                onChange={(e) => {
                                    setModuleFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                            >
                                <option value="">All Modules</option>
                                <option value="project">Projects</option>
                                <option value="finding">Findings</option>
                                <option value="action_plan">Action Plans</option>
                                <option value="comment">Comments</option>
                            </select>
                        </div>

                        {/* Action Dropdown */}
                        <div className="md:col-span-3">
                            <select
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                            >
                                <option value="">All Actions</option>
                                <option value="create">Created</option>
                                <option value="update">Updated</option>
                                <option value="workflow_changed">Workflow Changed</option>
                                <option value="extend">Due Date Extended</option>
                                <option value="close">Closed / Approved</option>
                                <option value="delete">Deleted</option>
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="md:col-span-1 flex md:justify-end">
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                    title="Reset all filters"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span className="md:hidden lg:inline">Reset</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row: Period Selector (Opsi B) & Active Indicator */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        {/* Left: Period Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-1">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>Period:</span>
                            </div>

                            {/* Main Period Select */}
                            <select
                                value={periodType}
                                onChange={(e) => handlePeriodTypeChange(e.target.value)}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer"
                            >
                                <option value="current_month">This Month</option>
                                <option value="previous_month">Last Month</option>
                                <option value="select_month">Select Specific Month</option>
                                <option value="custom_range">Custom Range (Max 31 Days)</option>
                            </select>

                            {/* Sub-selector: Specific Month */}
                            {periodType === "select_month" && (
                                <select
                                    value={selectedMonthKey}
                                    onChange={(e) => handleSpecificMonthChange(e.target.value)}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition cursor-pointer animate-in fade-in duration-200"
                                >
                                    {availableMonths.map((m) => (
                                        <option key={m.key} value={m.key}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Sub-selector: Custom Range with 2-month DatePicker */}
                            {periodType === "custom_range" && (
                                <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={rangeStart}
                                        endDate={rangeEnd}
                                        onChange={handleCustomRangeChange}
                                        monthsShown={2}
                                        minDate={
                                            rangeStart && !rangeEnd
                                                ? new Date(rangeStart.getTime() - 30 * 24 * 60 * 60 * 1000)
                                                : undefined
                                        }
                                        maxDate={
                                            rangeStart && !rangeEnd
                                                ? new Date(rangeStart.getTime() + 30 * 24 * 60 * 60 * 1000)
                                                : undefined
                                        }
                                        onCalendarClose={() => {
                                            if (rangeStart && !rangeEnd) {
                                                if (dateFrom && dateTo) {
                                                    setRangeStart(new Date(`${dateFrom}T00:00:00`));
                                                    setRangeEnd(new Date(`${dateTo}T00:00:00`));
                                                } else {
                                                    setRangeStart(null);
                                                    setRangeEnd(null);
                                                }
                                            }
                                        }}
                                        dateFormat="d MMM yyyy"
                                        popperPlacement="bottom-start"
                                        customInput={<CustomDateRangeInput />}
                                    />
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        (Max 31 days)
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right: Active Period Badge / Mode Indicator */}
                        <div className="flex items-center gap-2">
                            {allPeriodsSearch && debouncedSearch ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Search Mode: All Periods</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                                    <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                                    <span>
                                        {formatDate(dateFrom)} – {formatDate(dateTo)}
                                    </span>
                                </div>
                            )}

                            <div className="text-[11px] text-slate-400 hidden sm:inline">
                                Hal <span className="font-semibold text-slate-600">{pagination.current}</span> /{" "}
                                <span className="font-semibold text-slate-600">{pagination.last}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AUDIT LOG TABLE CARD */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    {loading ? (
                        <div className="p-6">
                            <TableSkeleton rows={8} />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={History}
                                title="No audit trail events found"
                                description={
                                    hasActiveFilters
                                        ? "No activity logs match your active filters. Try adjusting your search query or timeframe."
                                        : "No activity has been recorded in the system audit trail yet."
                                }
                                actionLabel={hasActiveFilters ? "Reset all filters" : undefined}
                                onAction={hasActiveFilters ? handleResetFilters : undefined}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-4">Timestamp</th>
                                        <th className="py-3.5 px-4">Actor</th>
                                        <th className="py-3.5 px-4">Event</th>
                                        <th className="py-3.5 px-4">Linked Context</th>
                                        <th className="py-3.5 px-4 min-w-[280px]">Activity Description</th>
                                        <th className="py-3.5 px-4 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {logs.map((log) => {
                                        const actionMeta = getActionMeta(log.action);
                                        const moduleMeta = getModuleMeta(log.module);
                                        const ModuleIcon = moduleMeta.icon;
                                        const hasDiff = Boolean(
                                            (log.old_values && Object.keys(log.old_values).length > 0) ||
                                            (log.new_values && Object.keys(log.new_values).length > 0)
                                        );

                                        const actorName = log.user?.name || "System Automated";
                                        const actorInitials = actorName
                                            .split(" ")
                                            .slice(0, 2)
                                            .map((p) => p[0])
                                            .join("")
                                            .toUpperCase();
                                        const actorRole = log.user?.role || "System";
                                        const actorLevel = log.user?.level;
                                        const actorDept = log.user?.department?.name;

                                        return (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-slate-50/70 transition-colors group"
                                            >
                                                {/* TIMESTAMP */}
                                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                                    <div className="font-semibold text-slate-800">
                                                        {formatDateTime(log.created_at)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{timeAgo(log.created_at)}</span>
                                                    </div>
                                                </td>

                                                {/* ACTOR */}
                                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                                    <div className="flex items-center gap-2.5">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-2xs shrink-0 ${getAvatarBg(
                                                                actorName
                                                            )}`}
                                                        >
                                                            {actorInitials}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 leading-tight">
                                                                {actorName}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="capitalize text-[10px] font-medium text-slate-500">
                                                                    {actorRole}
                                                                </span>
                                                                {actorLevel && (
                                                                    <>
                                                                        <span className="text-slate-300">•</span>
                                                                        <span className="text-[10px] font-medium text-slate-500">
                                                                            {actorLevel}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            {actorDept && (
                                                                <div className="text-[10px] text-slate-400">
                                                                    {actorDept}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* EVENT (MODULE & ACTION) */}
                                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${moduleMeta.badgeClass}`}
                                                        >
                                                            <ModuleIcon className="w-3 h-3" />
                                                            <span>{moduleMeta.label}</span>
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${actionMeta.badgeClass}`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${actionMeta.dotClass}`}
                                                            />
                                                            <span>{actionMeta.label}</span>
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* LINKED CONTEXT (PROJECT & FINDING CODES) */}
                                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        {log.finding_code && (
                                                            <div className="flex items-center gap-1.5">
                                                                {log.finding_id ? (
                                                                    <Link
                                                                        href={`/findings/${log.finding_id}`}
                                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/90 hover:bg-amber-100 hover:border-amber-300 transition group/link"
                                                                        title="Go to Finding details"
                                                                    >
                                                                        <AlertCircle className="w-3 h-3 text-amber-600" />
                                                                        <span>{log.finding_code}</span>
                                                                        <ArrowUpRight className="w-2.5 h-2.5 opacity-60 group-hover/link:opacity-100" />
                                                                    </Link>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/90">
                                                                        <AlertCircle className="w-3 h-3 text-amber-600" />
                                                                        <span>{log.finding_code}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {log.project_code && (
                                                            <div className="flex items-center gap-1.5">
                                                                {log.project_id ? (
                                                                    <Link
                                                                        href={`/projects/${log.project_id}`}
                                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200/90 hover:bg-sky-100 hover:border-sky-300 transition group/link"
                                                                        title="Go to Project details"
                                                                    >
                                                                        <FolderKanban className="w-3 h-3 text-sky-600" />
                                                                        <span>{log.project_code}</span>
                                                                        <ArrowUpRight className="w-2.5 h-2.5 opacity-60 group-hover/link:opacity-100" />
                                                                    </Link>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200/90">
                                                                        <FolderKanban className="w-3 h-3 text-sky-600" />
                                                                        <span>{log.project_code}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {!log.finding_code && !log.project_code && (
                                                            <span className="text-slate-300 text-[11px]">—</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* DESCRIPTION */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="text-slate-800 font-medium leading-relaxed">
                                                        {log.description}
                                                    </div>
                                                    {log.action_plan_task && (
                                                        <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] max-w-md truncate">
                                                            <ListTodo className="w-3 h-3 text-purple-500 shrink-0" />
                                                            <span className="font-medium text-slate-500 mr-0.5">Task:</span>
                                                            <span className="truncate">{log.action_plan_task}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* DETAILS / INSPECT */}
                                                <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => setInspectLog(log)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs hover:border-slate-300 transition cursor-pointer"
                                                        title="Inspect full audit event details"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>Details</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* MODERN PAGINATION FOOTER */}
                    {!loading && logs.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs">
                            <div className="text-slate-500">
                                Showing{" "}
                                <span className="font-semibold text-slate-700">
                                    {pagination.from || (pagination.current - 1) * perPage + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold text-slate-700">
                                    {pagination.to || Math.min(pagination.current * perPage, pagination.total)}
                                </span>{" "}
                                of <span className="font-semibold text-slate-700">{pagination.total}</span> logs
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Page size selector */}
                                <div className="flex items-center gap-1.5 text-slate-500 mr-2">
                                    <span>Rows:</span>
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none cursor-pointer"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>

                                {/* First Page */}
                                <button
                                    disabled={pagination.current === 1}
                                    onClick={() => setPage(1)}
                                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition cursor-pointer"
                                    title="First Page"
                                >
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>

                                {/* Prev Page */}
                                <button
                                    disabled={pagination.current === 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-medium transition cursor-pointer"
                                    title="Previous Page"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Prev</span>
                                </button>

                                <span className="px-2 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs">
                                    {pagination.current} / {pagination.last}
                                </span>

                                {/* Next Page */}
                                <button
                                    disabled={pagination.current === pagination.last}
                                    onClick={() => setPage((p) => Math.min(pagination.last, p + 1))}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-medium transition cursor-pointer"
                                    title="Next Page"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                {/* Last Page */}
                                <button
                                    disabled={pagination.current === pagination.last}
                                    onClick={() => setPage(pagination.last)}
                                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition cursor-pointer"
                                    title="Last Page"
                                >
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* POLISHED DETAILS INSPECTION MODAL */}
            {inspectLog && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-opacity"
                    onClick={() => setInspectLog(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between px-6 sm:px-8 pt-10 sm:pt-12 pb-6 border-b border-slate-100 bg-slate-50/80">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h3 className="font-bold text-slate-900 text-lg leading-snug tracking-tight">
                                        Audit Event #{inspectLog.id}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                            getActionMeta(inspectLog.action).badgeClass
                                        }`}
                                    >
                                        {getActionMeta(inspectLog.action).label}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                                            getModuleMeta(inspectLog.module).badgeClass
                                        }`}
                                    >
                                        {getModuleMeta(inspectLog.module).label}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Recorded on {formatDateTime(inspectLog.created_at)} by{" "}
                                    <span className="font-semibold text-slate-800">
                                        {inspectLog.user?.name || "System Automated"}
                                    </span>{" "}
                                    ({inspectLog.user?.role || "System"})
                                </p>
                            </div>
                            <button
                                onClick={() => setInspectLog(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer -mr-1"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-4 max-h-[70vh]">
                            {/* Context & Reference Banner */}
                            {(inspectLog.project_code || inspectLog.finding_code) && (
                                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 text-xs">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            {inspectLog.finding_code && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                        Finding:
                                                    </span>
                                                    <span className="font-mono font-bold px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs">
                                                        {inspectLog.finding_code}
                                                    </span>
                                                </div>
                                            )}

                                            {inspectLog.project_code && (
                                                <div className="flex items-center gap-1.5 ml-1">
                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                        Project:
                                                    </span>
                                                    <span className="font-mono font-bold px-2 py-0.5 bg-sky-50 text-sky-900 border border-sky-200 rounded text-xs">
                                                        {inspectLog.project_code}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Direct links */}
                                        <div className="flex items-center gap-2">
                                            {inspectLog.finding_id && (
                                                <Link
                                                    href={`/findings/${inspectLog.finding_id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200/80 transition"
                                                    onClick={() => setInspectLog(null)}
                                                >
                                                    <span>Open Finding</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                            {inspectLog.project_id && (
                                                <Link
                                                    href={`/projects/${inspectLog.project_id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200/80 transition"
                                                    onClick={() => setInspectLog(null)}
                                                >
                                                    <span>Open Project</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {inspectLog.finding_title && (
                                        <div className="text-xs text-slate-600 font-medium pt-1 border-t border-slate-200/60 flex items-center gap-1.5">
                                            <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Title:</span>
                                            <span className="text-slate-800 font-semibold">{inspectLog.finding_title}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Event summary text */}
                            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                                <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px]">
                                    Activity Summary
                                </span>
                                <div className="text-slate-800 font-semibold text-sm leading-snug">
                                    {inspectLog.description}
                                </div>
                                {inspectLog.action_plan_task && (
                                    <div className="text-xs text-slate-600 pt-1">
                                        <span className="font-semibold text-slate-500">Action Plan: </span>
                                        {inspectLog.action_plan_task}
                                    </div>
                                )}
                            </div>

                            {/* Intelligent Event Details Presentation */}
                            <CleanEventDetails log={inspectLog} />
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between px-6 sm:px-8 pt-5 pb-7 border-t border-slate-100 bg-slate-50/60">
                            <span className="text-[11px] text-slate-400">
                                Log Reference ID: #{inspectLog.id}
                            </span>
                            <button
                                type="button"
                                onClick={() => setInspectLog(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-2xs transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Subcomponent: Clean, Intelligent Event Details Inspector
function CleanEventDetails({ log }) {
    const action = log.action;
    const module = log.module;
    const oldValues = log.old_values;
    const newValues = log.new_values;

    const act = normalize(action);
    const mod = normalize(module);
    const isCreate = act === "create" || (!oldValues && Boolean(newValues));

    // CASE 0: COMMENT MODULE -> Render clean Comment Message Card
    if (mod === "comment" || log.comment_message) {
        const commentMsg =
            log.comment_message ||
            (newValues && typeof newValues === "object"
                ? newValues.comment || newValues.message
                : null);

        return (
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Comment Message</span>
                </h4>
                {commentMsg ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                        &ldquo;{commentMsg}&rdquo;
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 italic text-center">
                        Comment recorded on the action plan thread.
                    </div>
                )}
            </div>
        );
    }

    // CASE 1: CREATION EVENT -> Show clean Key-Value Attribute Cards (NO empty '-' columns!)
    if (isCreate) {
        const raw = newValues && typeof newValues === "object" ? newValues : {};
        // Filter out redundant technical dumps
        const keys = Object.keys(raw).filter(
            (k) =>
                !["created_at", "updated_at", "password", "remember_token"].includes(k) &&
                !(k === "creator" && typeof raw[k] === "object") // avoid raw creator object dump
        );

        if (keys.length === 0) {
            return (
                <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center border border-dashed border-slate-200">
                    New record created successfully.
                </div>
            );
        }

        return (
            <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Registered Attributes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {keys.map((k) => (
                        <div
                            key={k}
                            className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between"
                        >
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                {formatFieldName(k)}
                            </span>
                            <div className="text-xs font-semibold text-slate-800">
                                {formatValueDisplay(raw[k], k)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // CASE 2: UPDATES / WORKFLOW / EXTEND -> Show Only Actual Field Diffs with Before -> After Transitions
    const isOldObj = oldValues && typeof oldValues === "object";
    const isNewObj = newValues && typeof newValues === "object";

    // Collect keys where old != new
    const changedKeys = Array.from(
        new Set([
            ...(isOldObj ? Object.keys(oldValues) : []),
            ...(isNewObj ? Object.keys(newValues) : []),
        ])
    ).filter((key) => {
        if (["created_at", "updated_at", "id", "password", "remember_token"].includes(key)) return false;
        const oldV = isOldObj ? oldValues[key] : undefined;
        const newV = isNewObj ? newValues[key] : undefined;
        return JSON.stringify(oldV) !== JSON.stringify(newV);
    });

    if (changedKeys.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center border border-dashed border-slate-200">
                Action executed successfully with no persistent data changes.
            </div>
        );
    }

    return (
        <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Modified Fields & Transitions</span>
                <span className="text-[11px] font-medium text-slate-400">
                    {changedKeys.length} field{changedKeys.length > 1 ? "s" : ""} modified
                </span>
            </h4>

            <div className="space-y-2.5">
                {changedKeys.map((key) => {
                    const oldVal = isOldObj ? oldValues[key] : undefined;
                    const newVal = isNewObj ? newValues[key] : undefined;

                    return (
                        <div
                            key={key}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                        >
                            <div className="font-semibold text-xs text-slate-700 flex items-center justify-between">
                                <span>{formatFieldName(key)}</span>
                                <span className="font-mono text-[10px] text-slate-400">{key}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                                {/* Previous Value */}
                                <div className="flex-1 p-2 rounded-lg bg-rose-50/70 border border-rose-200/70 text-xs">
                                    <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider block mb-0.5">
                                        Previous
                                    </span>
                                    <div className="text-rose-900 font-medium break-all line-through opacity-85">
                                        {formatValueDisplay(oldVal, key)}
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center justify-center text-slate-400">
                                    <ArrowRight className="w-4 h-4" />
                                </div>

                                {/* New Value */}
                                <div className="flex-1 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-xs">
                                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block mb-0.5">
                                        Updated
                                    </span>
                                    <div className="text-emerald-950 font-bold break-all">
                                        {formatValueDisplay(newVal, key)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
