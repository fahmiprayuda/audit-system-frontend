"use client";

import { useState, useMemo } from "react";
import useUsers from "@/app/users/hooks/useUsers";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
    Search,
    X,
    Pencil,
    KeyRound,
    Trash2,
    UserPlus,
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

    // Tab: "audit" | "auditee" | "all"
    const [activeTab, setActiveTab] = useState("audit");
    const [search, setSearch] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [deletingUser, setDeletingUser] = useState(false);

    // Separate groups
    const auditUsers = useMemo(
        () => users.filter((u) => ["manager", "auditor"].includes(u.role)),
        [users]
    );

    const auditeeUsers = useMemo(
        () => users.filter((u) => u.role === "auditee"),
        [users]
    );

    // Filtered list
    const filteredUsers = useMemo(() => {
        let baseList = users;
        if (activeTab === "audit") baseList = auditUsers;
        if (activeTab === "auditee") baseList = auditeeUsers;

        if (!search.trim()) return baseList;

        const q = search.toLowerCase();
        return baseList.filter((u) =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.level?.toLowerCase().includes(q) ||
            u.company?.name?.toLowerCase().includes(q) ||
            u.department?.name?.toLowerCase().includes(q)
        );
    }, [users, auditUsers, auditeeUsers, activeTab, search]);

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-5">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        User Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola akun tim internal audit dan auditee
                    </p>
                </div>

                <button
                    onClick={() => {
                        closeModal();
                        setShowCreate(true);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                    <UserPlus size={16} />
                    <span>+ Add User</span>
                </button>
            </div>

            {/* SIMPLE TABS & SEARCH BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                {/* Tabs */}
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("audit")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                            activeTab === "audit"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                        Internal Audit ({auditUsers.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("auditee")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                            activeTab === "auditee"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                        Auditee ({auditeeUsers.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                            activeTab === "all"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                        Semua ({users.length})
                    </button>
                </div>

                {/* Compact Search */}
                <div className="relative w-full sm:w-64">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, email, level..."
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* USER TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <tr>
                            <th className="py-3 px-4">Nama</th>
                            <th className="py-3 px-4">Email</th>
                            {activeTab !== "auditee" && (
                                <th className="py-3 px-4">Role</th>
                            )}
                            <th className="py-3 px-4">Level / Jabatan</th>
                            {activeTab !== "audit" && (
                                <>
                                    <th className="py-3 px-4">Company</th>
                                    <th className="py-3 px-4">Department</th>
                                </>
                            )}
                            <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={activeTab === "all" ? 6 : activeTab === "auditee" ? 5 : 4}
                                    className="py-12 text-center text-sm text-slate-400"
                                >
                                    Tidak ada user ditemukan
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/60 transition">
                                    <td className="py-3 px-4 font-semibold text-slate-900">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 text-xs font-mono">
                                        {user.email}
                                    </td>

                                    {/* Role Column (only when showing Audit Team or All) */}
                                    {activeTab !== "auditee" && (
                                        <td className="py-3 px-4">
                                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-700">
                                                {user.role}
                                            </span>
                                        </td>
                                    )}

                                    {/* Level / Position */}
                                    <td className="py-3 px-4">
                                        {user.level ? (
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                                                {user.level}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">-</span>
                                        )}
                                    </td>

                                    {/* Company & Department (only for Auditee or All) */}
                                    {activeTab !== "audit" && (
                                        <>
                                            <td className="py-3 px-4 text-xs text-slate-700">
                                                {user.company?.name || "-"}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-slate-700">
                                                {user.department?.name || "-"}
                                            </td>
                                        </>
                                    )}

                                    {/* Action Buttons */}
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1 text-slate-500">
                                            <button
                                                type="button"
                                                onClick={() => editUser(user)}
                                                className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openResetPassword(user)}
                                                className="p-1.5 rounded hover:bg-slate-100 hover:text-amber-600 transition"
                                                title="Reset Password"
                                            >
                                                <KeyRound size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setUserToDelete(user)}
                                                className="p-1.5 rounded hover:bg-slate-100 hover:text-rose-600 transition cursor-pointer"
                                                title="Delete User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL: CREATE / EDIT USER */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingUser ? "Edit User" : "Tambah User"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => closeModal()}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3.5">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1 block">Nama Lengkap</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1 block">Email</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="user@audit.com"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Password</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="password"
                                        placeholder="Min. 6 karakter"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1 block">Role</label>
                                <select
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                    <option value="manager">Manager (Audit Head)</option>
                                    <option value="auditor">Auditor</option>
                                    <option value="auditee">Auditee</option>
                                </select>
                            </div>

                            {/* Position Level */}
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                    Level / Jabatan
                                </label>
                                <div className="space-y-1.5">
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                        <option value="">Select Position / Title</option>
                                        {(roleLevels[form.role] || []).map((lvl) => (
                                            <option key={lvl} value={lvl}>
                                                {lvl}
                                            </option>
                                        ))}
                                        <option value="other">Custom Position...</option>
                                    </select>

                                    {(!((roleLevels[form.role] || []).includes(form.level)) || form.level === "") && (
                                        <input
                                            type="text"
                                            placeholder="Type custom position..."
                                            value={form.level || ""}
                                            onChange={(e) => setForm({ ...form, level: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Auditee-only Company & Department */}
                            {form.role === "auditee" && (
                                <>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Company</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => closeModal()}
                                className="border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={editingUser ? updateUser : createUser}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                            >
                                Save User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: RESET PASSWORD */}
            {showResetPassword && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
                        <h2 className="text-base font-bold text-slate-900 mb-1">Reset Password</h2>
                        <p className="text-xs text-slate-500 mb-3">
                            User: <span className="font-semibold text-slate-700">{selectedUser?.name}</span>
                        </p>
                        <input
                            type="password"
                            placeholder="Password baru (min. 6)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowResetPassword(false)}
                                className="border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={resetPassword}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE USER CONFIRM DIALOG */}
            <ConfirmDialog
                isOpen={Boolean(userToDelete)}
                onClose={() => setUserToDelete(null)}
                onConfirm={async () => {
                    setDeletingUser(true);
                    await deleteUser(userToDelete.id);
                    setDeletingUser(false);
                    setUserToDelete(null);
                }}
                title="Delete User"
                message={`Are you sure you want to delete user "${userToDelete?.name}" (${userToDelete?.email})? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
                variant="danger"
                loading={deletingUser}
            />
        </div>
    );
}
