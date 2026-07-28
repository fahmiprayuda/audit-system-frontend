"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function UsersPage() {

    const [showResetPassword,
        setShowResetPassword] =
        useState(false);

    const [selectedUser,
        setSelectedUser] =
        useState(null);

    const [newPassword,
        setNewPassword] =
        useState("");

    const [companies, setCompanies] = useState([]);

    const loadCompanies = async () => {

        const res = await api.get(
            "/master/companies"
        );

        setCompanies(res.data);

    };


    const openResetPassword = (
        user
    ) => {

        setSelectedUser(user);

        setNewPassword("");

        setShowResetPassword(true);

    };

    const resetPassword =
        async () => {

            if (newPassword.length < 6) {
                return alert("Password minimal 6 karakter");
            }

            await api.post(
                `/users/${selectedUser.id}/reset-password`,
                {
                    password: newPassword
                }
            );

            alert(
                "Password updated"
            );

            setShowResetPassword(false);

        };

    const [users, setUsers] =
        useState([]);

    const loadUsers = async () => {

        const res =
            await api.get("/users");

        setUsers(res.data);

    };


    const [showCreate, setShowCreate] =
        useState(false);

    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: "",
            role: "auditee",
            company_id: "",
            department_id: ""
        });

    const [departments, setDepartments] =
        useState([]);

    const loadDepartments = async (companyId) => {

        if (!companyId) {

            setDepartments([]);

            return;

        }

        const res = await api.get(
            `/master/companies/${companyId}/departments`
        );

        setDepartments(res.data);

    };

    const createUser =
        async () => {

            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                department_id:
                    form.role === "auditee"
                        ? form.department_id
                        : null,
            };

            await api.post("/users", payload);

            alert("User created successfully");

            closeModal();

            loadUsers();

            setForm({
                name: "",
                email: "",
                password: "",
                role: "auditee",
                company_id: "",
                department_id: ""
            });

        };

    const [editingUser, setEditingUser] =
        useState(null);

    const editUser = (user) => {

        setEditingUser(user);

        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            company_id: user.company_id || "",
            department_id:
                user.department_id || ""
        });

        loadDepartments(user.company?.id);

        setShowCreate(true);
    };
    const deleteUser = async (id) => {

        if (
            !confirm(
                "Delete this user?"
            )
        ) return;

        try {

            await api.delete(
                `/users/${id}`
            );

            alert("Deleted Successfully");

            loadUsers();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed"
            );

        }
    };

    const updateUser = async () => {

        try {

            await api.put(
                `/users/${editingUser.id}`,
                form
            );

            alert("Updated");

            closeModal();

            setEditingUser(null);

            loadUsers();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed"
            );

        }

    };

    const closeModal = () => {
        setShowCreate(false);

        setEditingUser(null);

        setForm({
            name: "",
            email: "",
            password: "",
            role: "auditee",
            company_id: "",
            department_id: ""
        });
    };

    useEffect(() => {
        loadUsers();
        loadCompanies();
    }, []);


    return (
        <div className="p-6">

            <div className="flex justify-between mb-6">

                <h1 className="text-2xl font-bold">
                    User Management
                </h1>

                <button
                    onClick={() => {
                        closeModal();
                        setShowCreate(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition">
                    + User
                </button>

            </div>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full table-auto border-collapse border border-gray-300">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Name</th>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Email</th>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Role</th>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Company</th>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Department</th>
                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 border-t border-slate-100">{user.name}</td>
                                <td className="px-6 py-4 border-t border-slate-100">{user.email}</td>
                                <td className="px-6 py-4 border-t border-slate-100">{user.role}</td>
                                <td className="px-6 py-4 border-t border-slate-100">
                                    {user.company ? (
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-md">
                                            {user.company?.name}
                                        </span>
                                    ) : ("-")}
                                </td>
                                <td className="px-6 py-4 border-t border-slate-100">
                                    {user.department ? (
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-md">
                                            {user.department?.name}
                                        </span>
                                    ) : ("-")}
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => editUser(user)}>✏️</button>
                                    <button onClick={() => openResetPassword(user)}>🔑</button>
                                    <button onClick={() => deleteUser(user.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Start Modal */}
            {showCreate && (

                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[500px]">

                        <h2 className="text-2xl font-bold mb-6">
                            {editingUser ? "Edit User" : "Create User"}</h2>

                        <label className="text-md font-medium mb-2 block">Full Name</label>
                        <input className="w-full mb-6 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                        />

                        <label className="text-md font-medium mb-2 block">Email</label>
                        <input className="w-full mb-6 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }
                        />

                        {!editingUser && (
                            <label className="text-md font-medium mb-2 block">Password</label>
                        )}
                        {!editingUser && (
                            <input className="w-full mb-6 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                            />
                        )}

                        <label className="text-md font-medium mb-2 block">Role  </label>
                        <select className="w-full mb-6 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.role}
                            onChange={(e) => {

                                const role = e.target.value;

                                setForm({
                                    ...form,
                                    role,
                                    company_id:
                                        role === "auditee"
                                            ? form.company_id
                                            : "",
                                    department_id:
                                        role === "auditee"
                                            ? form.department_id
                                            : "",
                                });

                            }}
                        >
                            <option value="manager">Manager</option>
                            <option value="auditor">Auditor</option>
                            <option value="auditee">Auditee</option>
                        </select>

                        {form.role === "auditee" && (
                            <>
                                <label className="text-md font-medium mb-2 block">Company</label>
                                <select className="w-full mb-10 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <option
                                            key={company.id}
                                            value={company.id}
                                        >
                                            {company.name}
                                        </option>
                                    ))}
                                </select>

                                <label className="text-md font-medium mb-2 block">Department</label>
                                <select className="w-full mb-10 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            </>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => closeModal()} className="border px-5 py-2.5 rounded-xl">
                                Cancel
                            </button>
                            <button
                                onClick={editingUser ? updateUser : createUser} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl ">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* End Modal */}

            {/* Start Modal Change Password */}
            {showResetPassword && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-[400px]">
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <p className="mb-2 text-gray-500">{selectedUser?.name}</p>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            className="w-full border p-3 rounded mb-4"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() =>
                                    setShowResetPassword(false)
                                }
                                className="border px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={resetPassword}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* End Modal Change Password */}

        </div>
    );
}