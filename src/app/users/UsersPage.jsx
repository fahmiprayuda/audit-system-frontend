"use client";

import { useState, useMemo } from "react";
import useUsers from "@/app/users/hooks/useUsers";
import {
    Users,
    ShieldCheck,
    Building2,
    Briefcase,
    Search,
    X,
    Filter,
    Pencil,
    KeyRound,
    Trash2,
    UserPlus,
    RotateCcw,
    Shield,
    Check,
    AlertCircle,
    Lock
} from "lucide-react";

const roleLevels = {
    manager: [
        "Audit Head",
        "Audit Manager",
        "VP of Internal Audit",
        "Lead Quality Assurance",
    ],
    auditor: [
        "Junior Auditor",
        "Senior Auditor",
        "Audit Supervisor",
        "Lead Auditor",
        "IT Audit Specialist",
    ],
    auditee: [
        "Staff",
        "Supervisor",
        "Department Manager",
        "Department Head / PIC",
        "General Manager",
    ],
};

export default function UsersPage() {
    const {
        showResetPassword,
        setShowResetPassword,
        selectedUser,
        newPassword,
        setNewPassword,
        companies,
        openResetPassword,
        resetPassword,
        users,
        showCreate,
        setShowCreate,
        form,
        setForm,
        departments,
        loadDepartments,
        createUser,
        editingUser,
        editUser,
        deleteUser,
        updateUser,
        closeModal
    } = useUsers();

    // Tab view: "all" | "audit" | "auditee"
    const [activeTab, setActiveTab] = useState("audit");

    // Search and filters
    const [search, setSearch] = useState("");
    const [filterCompany, setFilterCompany] = useState("all");
    const [filterRole, setFilterRole] = useState("all");

    // Separate groups
    const auditUsers = useMemo(
        () => users.filter((u) => ["manager", "auditor"].includes(u.role)),
        [users]
    );

    const auditeeUsers = useMemo(
        () => users.filter((u) => u.role === "auditee"),
        [users]
    );

    // Filtered users according to active tab & search query
    const filteredUsers = useMemo(() => {
        let baseList = users;
        if (activeTab === "audit") baseList = auditUsers;
        if (activeTab === "auditee") baseList = auditeeUsers;

        return baseList.filter((u) => {
            const query = search.trim().toLowerCase();
            const matchesSearch =
                !query ||
                u.name?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query) ||
                u.level?.toLowerCase().includes(query) ||
                u.company?.name?.toLowerCase().includes(query) ||
                u.department?.name?.toLowerCase().includes(query);

            const matchesCompany =
                filterCompany === "all" || String(u.company?.id) === String(filterCompany);

            const matchesRole =
                filterRole === "all" || u.role === filterRole;

            return matchesSearch && matchesCompany && matchesRole;
        });
    }, [users, auditUsers, auditeeUsers, activeTab, search, filterCompany, filterRole]);

    // Unique departments covered
    const uniqueDepartmentsCount = useMemo(() => {
        const deptIds = new Set();
        auditeeUsers.forEach((u) => {
            if (u.department?.id) deptIds.add(u.department.id);
        });
        return deptIds.size;
    }, [auditeeUsers]);

    // Helper for initials
    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ").filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            {/* TOP HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        User Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage internal audit personnel, assign position levels, and configure auditee accounts
                    </p>
                </div>

                <button
                    onClick={() => {
                        closeModal();
                        setShowCreate(true);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer shadow-sm hover:shadow self-start sm:self-auto"
                >
                    <UserPlus size={16} />
                    <span>Add New User</span>
                </button>
            </div>

            {/* KPI METRICS OVERVIEW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    type="button"
                    onClick={() => setActiveTab("audit")}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        activeTab === "audit"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/10"
                            : "bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === "audit" ? "text-indigo-100" : "text-indigo-700"}`}>
                            Internal Audit Team
                        </span>
                        <div className={`p-2 rounded-xl ${activeTab === "audit" ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"}`}>
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black">
                        {auditUsers.length}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${activeTab === "audit" ? "text-indigo-100" : "text-slate-500"}`}>
                        Audit Heads & Auditors
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("auditee")}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        activeTab === "auditee"
                            ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/10"
                            : "bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === "auditee" ? "text-blue-100" : "text-blue-700"}`}>
                            Auditees / PICs
                        </span>
                        <div className={`p-2 rounded-xl ${activeTab === "auditee" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                            <Building2 size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black">
                        {auditeeUsers.length}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${activeTab === "auditee" ? "text-blue-100" : "text-slate-500"}`}>
                        Department PICs & Leads
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        activeTab === "all"
                            ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === "all" ? "text-slate-300" : "text-slate-500"}`}>
                            Total Accounts
                        </span>
                        <div className={`p-2 rounded-xl ${activeTab === "all" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black">
                        {users.length}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${activeTab === "all" ? "text-slate-300" : "text-slate-500"}`}>
                        Active system users
                    </div>
                </button>

                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Covered Divisions
                        </span>
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                            <Briefcase size={16} />
                        </div>
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                        {uniqueDepartmentsCount}
                    </div>
                    <div className="text-xs mt-1 font-medium text-slate-500">
                        {companies.length} Companies audited
                    </div>
                </div>
            </div>

            {/* SEGMENTED TABS (SEPARATING AUDIT VS AUDITEE) */}
            <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("audit");
                        setFilterRole("all");
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 border-b-2 text-sm font-semibold transition cursor-pointer shrink-0 ${
                        activeTab === "audit"
                            ? "border-indigo-600 text-indigo-700 bg-indigo-50/40"
                            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                >
                    <ShieldCheck size={16} className={activeTab === "audit" ? "text-indigo-600" : "text-slate-400"} />
                    <span>Internal Audit Team</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === "audit" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                        {auditUsers.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("auditee");
                        setFilterRole("all");
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 border-b-2 text-sm font-semibold transition cursor-pointer shrink-0 ${
                        activeTab === "auditee"
                            ? "border-blue-600 text-blue-700 bg-blue-50/40"
                            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                >
                    <Building2 size={16} className={activeTab === "auditee" ? "text-blue-600" : "text-slate-400"} />
                    <span>Auditees & Business Units</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === "auditee" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                        {auditeeUsers.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("all");
                        setFilterRole("all");
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 border-b-2 text-sm font-semibold transition cursor-pointer shrink-0 ${
                        activeTab === "all"
                            ? "border-slate-900 text-slate-900 bg-slate-50/50"
                            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                >
                    <Users size={16} className={activeTab === "all" ? "text-slate-900" : "text-slate-400"} />
                    <span>All Accounts</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                        {users.length}
                    </span>
                </button>
            </div>

            {/* SEARCH & FILTERS TOOLBAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                {/* Search Box */}
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={
                            activeTab === "audit"
                                ? "Search auditor by name, email, level (e.g. Senior Auditor)..."
                                : activeTab === "auditee"
                                ? "Search auditee by name, email, company, or department..."
                                : "Search all users by name, email, role, or position level..."
                        }
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

                {/* Filters */}
                <div className="flex items-center gap-2">
                    {/* Role Filter (when in audit or all tab) */}
                    {activeTab !== "auditee" && (
                        <div className="relative">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="text-xs font-semibold pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition cursor-pointer appearance-none"
                            >
                                <option value="all">All Roles</option>
                                <option value="manager">Manager / Head</option>
                                <option value="auditor">Auditor</option>
                                {activeTab === "all" && <option value="auditee">Auditee</option>}
                            </select>
                            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    )}

                    {/* Company Filter (when in auditee or all tab) */}
                    {activeTab !== "audit" && (
                        <div className="relative">
                            <select
                                value={filterCompany}
                                onChange={(e) => setFilterCompany(e.target.value)}
                                className="text-xs font-semibold pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition cursor-pointer appearance-none max-w-[160px] truncate"
                            >
                                <option value="all">All Companies</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.code || c.name}
                                    </option>
                                ))}
                            </select>
                            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    )}

                    {(search || filterCompany !== "all" || filterRole !== "all") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setFilterCompany("all");
                                setFilterRole("all");
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Reset filters"
                        >
                            <RotateCcw size={13} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}

                    <div className="text-xs font-semibold text-slate-500 whitespace-nowrap pl-1">
                        Showing <span className="text-slate-900 font-bold">{filteredUsers.length}</span> users
                    </div>
                </div>
            </div>

            {/* USER LIST TABLES ACCORDING TO ACTIVE TAB */}

            {/* TAB 1: INTERNAL AUDIT TEAM TABLE */}
            {activeTab === "audit" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <ShieldCheck size={16} className="text-indigo-600" />
                                <span>Internal Audit Division Personnel</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Team members with audit creation, review, and project management privileges
                            </p>
                        </div>
                        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
                            {filteredUsers.length} Members
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/40 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="py-4 px-6">Personnel Name & Email</th>
                                    <th className="py-4 px-6">System Access Role</th>
                                    <th className="py-4 px-6">Position Level</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.role === "manager" ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold rounded-full">
                                                    <Shield size={12} className="text-purple-600" />
                                                    <span>Audit Head / Manager</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold rounded-full">
                                                    <ShieldCheck size={12} className="text-blue-600" />
                                                    <span>Auditor</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.level ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                                                    {user.level}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span>Active</span>
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => editUser(user)}
                                                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                                                    title="Edit Personnel"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => openResetPassword(user)}
                                                    className="p-2 rounded-xl hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition"
                                                    title="Reset Password"
                                                >
                                                    <KeyRound size={15} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                                                    title="Delete Personnel"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: AUDITEES & BUSINESS UNITS TABLE */}
            {activeTab === "auditee" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <Building2 size={16} className="text-blue-600" />
                                <span>Auditee Department Representatives</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Unit personnel responsible for action plan response, remediation comments, and evidence submission
                            </p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full">
                            {filteredUsers.length} Auditees
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/40 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="py-4 px-6">Auditee Contact</th>
                                    <th className="py-4 px-6">Company</th>
                                    <th className="py-4 px-6">Department</th>
                                    <th className="py-4 px-6">Position Level</th>
                                    <th className="py-4 px-6">Remediation Role</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-xs text-emerald-800 shrink-0">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.company ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/70">
                                                    <Building2 size={12} className="text-slate-500" />
                                                    <span>{user.company?.name}</span>
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.department ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                                                    <Briefcase size={12} className="text-blue-500" />
                                                    <span>{user.department?.name}</span>
                                                </span>
                                            ) : (
                                                <span className="text-rose-600 text-xs font-semibold">Missing Department</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.level ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                    {user.level}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Staff</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-xs text-slate-500 font-medium">
                                                Action Plan PIC
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => editUser(user)}
                                                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                                                    title="Edit Auditee"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => openResetPassword(user)}
                                                    className="p-2 rounded-xl hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition"
                                                    title="Reset Password"
                                                >
                                                    <KeyRound size={15} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                                                    title="Delete Auditee"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: ALL USERS CONSOLIDATED TABLE */}
            {activeTab === "all" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="py-4 px-6">User Profile</th>
                                    <th className="py-4 px-6">Role</th>
                                    <th className="py-4 px-6">Level / Position</th>
                                    <th className="py-4 px-6">Company</th>
                                    <th className="py-4 px-6">Department</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                                                    user.role === "auditee"
                                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                                        : "bg-indigo-100 text-indigo-800 border-indigo-200"
                                                }`}>
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`capitalize px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                user.role === "manager"
                                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                                    : user.role === "auditor"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.level ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                                    {user.level}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-xs text-slate-600">
                                            {user.company?.name || "-"}
                                        </td>
                                        <td className="py-4 px-6 text-xs text-slate-600">
                                            {user.department?.name || "-"}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => editUser(user)}
                                                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                                                    title="Edit User"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => openResetPassword(user)}
                                                    className="p-2 rounded-xl hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition"
                                                    title="Reset Password"
                                                >
                                                    <KeyRound size={15} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL: CREATE / EDIT USER */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingUser ? "Edit User Account" : "Create New User"}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Configure personnel credentials, role permissions, and position level
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => closeModal()}
                                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* User Type Toggle */}
                        <div className="mb-6 p-1 bg-slate-100 rounded-xl grid grid-cols-2 gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({
                                        ...form,
                                        role: "auditor",
                                        level: "Senior Auditor",
                                        company_id: "",
                                        department_id: "",
                                    });
                                }}
                                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                    form.role !== "auditee"
                                        ? "bg-white text-indigo-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <ShieldCheck size={14} />
                                <span>Internal Audit Team</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({
                                        ...form,
                                        role: "auditee",
                                        level: "Staff",
                                    });
                                }}
                                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                    form.role === "auditee"
                                        ? "bg-white text-blue-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Building2 size={14} />
                                <span>Auditee / Department</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name</label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                    placeholder="Enter full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Work Email</label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono"
                                    placeholder="name@audit.com"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Initial Password</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        type="password"
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-1.5 block">System Access Role</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
                                    value={form.role}
                                    onChange={(e) => {
                                        const role = e.target.value;
                                        const defaultLevels = {
                                            manager: "Audit Head",
                                            auditor: "Senior Auditor",
                                            auditee: "Staff",
                                        };
                                        setForm({
                                            ...form,
                                            role,
                                            level: defaultLevels[role] || "",
                                            company_id: role === "auditee" ? form.company_id : "",
                                            department_id: role === "auditee" ? form.department_id : "",
                                        });
                                    }}
                                >
                                    <option value="manager">Manager (Audit Head / Leader)</option>
                                    <option value="auditor">Auditor (Internal Audit Staff)</option>
                                    <option value="auditee">Auditee (Department Team / PIC)</option>
                                </select>
                            </div>

                            {/* Position Level */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-slate-700 block">
                                        Position / Audit Level
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        (e.g. Senior Auditor, Supervisor)
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <select
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
                                        value={
                                            (roleLevels[form.role] || []).includes(form.level)
                                                ? form.level
                                                : form.level ? "other" : ""
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "other") {
                                                setForm({ ...form, level: "" });
                                            } else {
                                                setForm({ ...form, level: val });
                                            }
                                        }}
                                    >
                                        <option value="">-- Choose Position Level --</option>
                                        {(roleLevels[form.role] || []).map((lvl) => (
                                            <option key={lvl} value={lvl}>
                                                {lvl}
                                            </option>
                                        ))}
                                        <option value="other">Custom / Other Position...</option>
                                    </select>

                                    {(!((roleLevels[form.role] || []).includes(form.level)) || form.level === "") && (
                                        <input
                                            type="text"
                                            placeholder="Type custom title / level (e.g. Lead Risk Officer)"
                                            value={form.level || ""}
                                            onChange={(e) => setForm({ ...form, level: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Auditee-only Company & Department Selectors */}
                            {form.role === "auditee" && (
                                <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3.5">
                                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                                        <Building2 size={14} className="text-blue-600" />
                                        <span>Auditee Company & Department Assignment</span>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Company</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                            value={form.company_id}
                                            onChange={(e) => {
                                                const company_id = e.target.value;
                                                setForm(prev => ({
                                                    ...prev,
                                                    company_id,
                                                    department_id: "",
                                                }));
                                                loadDepartments(company_id);
                                            }}
                                        >
                                            <option value="">Select Company</option>
                                            {companies.map(company => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Department</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                            value={form.department_id}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    department_id: e.target.value
                                                })
                                            }
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => closeModal()}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={editingUser ? updateUser : createUser}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
                            >
                                {editingUser ? "Save Changes" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: RESET PASSWORD */}
            {showResetPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
                    <div className="bg-white p-6 sm:p-7 rounded-2xl w-full max-w-sm shadow-2xl">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Reset User Password</h2>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                            Create a new password for <span className="font-bold text-slate-800">{selectedUser?.name}</span> ({selectedUser?.email})
                        </p>

                        <div className="mb-5">
                            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter min. 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowResetPassword(false)}
                                className="border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={resetPassword}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
                            >
                                Set New Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
