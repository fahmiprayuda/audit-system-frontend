"use client";

import useUsers from "@/app/users/hooks/useUsers";

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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        User Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage internal audit team members, roles, position levels & auditee accounts
                    </p>
                </div>

                <button
                    onClick={() => {
                        closeModal();
                        setShowCreate(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition cursor-pointer shadow-sm">
                    + Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200/80">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs uppercase font-bold tracking-wider text-slate-500">Name</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-bold tracking-wider text-slate-500">Email</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-bold tracking-wider text-slate-500">Role</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-bold tracking-wider text-slate-500">Level / Position</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-bold tracking-wider text-slate-500">Company</th>
                            <th className="px-6 py-4 text-left text-xs uppercase font-bold tracking-wider text-slate-500">Department</th>
                            <th className="px-6 py-4 text-right text-xs uppercase font-bold tracking-wider text-slate-500">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                                <td className="px-6 py-4 text-slate-600 text-sm font-mono">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="capitalize px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 border border-slate-200">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.level ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                                            {user.level}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {user.company ? (
                                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/60">
                                            {user.company?.name}
                                        </span>
                                    ) : ("-")}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {user.department ? (
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200/60">
                                            {user.department?.name}
                                        </span>
                                    ) : ("-")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => editUser(user)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                                            title="Edit User"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => openResetPassword(user)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                                            title="Reset Password"
                                        >
                                            🔑
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition"
                                            title="Delete User"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Start Modal Create / Edit */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            {editingUser ? "Edit User" : "Create New User"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Full Name</label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Email Address</label>
                                <input
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="user@audit.com"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="password"
                                        placeholder="Min. 6 characters"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Role</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                    <option value="auditor">Auditor (Internal Auditor)</option>
                                    <option value="auditee">Auditee (Department Team)</option>
                                </select>
                            </div>

                            {/* LEVEL / POSITION SELECTOR */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-slate-700 block">
                                        Position / Audit Level
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        (e.g. Senior Auditor, Supervisor)
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <select
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                            placeholder="Type custom title / level (e.g. Audit Senior, Risk Specialist)"
                                            value={form.level || ""}
                                            onChange={(e) => setForm({ ...form, level: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                                        />
                                    )}
                                </div>
                            </div>

                            {form.role === "auditee" && (
                                <>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Company</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Department</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            {/* End Modal */}

            {/* Start Modal Change Password */}
            {showResetPassword && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h2>
                        <p className="mb-4 text-xs text-slate-500 font-medium">User: {selectedUser?.name}</p>
                        <input
                            type="password"
                            placeholder="Enter new password (min. 6)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowResetPassword(false)}
                                className="border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetPassword}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* End Modal Change Password */}
        </div>
    );
}
