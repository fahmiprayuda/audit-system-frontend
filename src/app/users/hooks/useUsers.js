"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useUsers() {
    const initialForm = {
        name: "",
        email: "",
        password: "",
        role: "auditee",
        company_id: "",
        department_id: "",
    };

    const [companies, setCompanies] = useState([]);

    const [departments, setDepartments] = useState([]);

    const [users, setUsers] = useState([]);

    const [showCreate, setShowCreate] = useState(false);

    const [showResetPassword, setShowResetPassword] = useState(false);

    const [form, setForm] = useState(initialForm);

    const [selectedUser, setSelectedUser] = useState(null);

    const [newPassword, setNewPassword] = useState("");

    const [editingUser, setEditingUser] = useState(null);

    const loadCompanies = useCallback(async () => {
        try {
            const res = await api.get("/master/companies");
            setCompanies(
                res.data || []);
        } catch (err) {
            console.error(err);
            setCompanies([]);
        };
    }, []);

    const loadDepartments = async (companyId) => {
        if (!companyId) {
            setDepartments([]);
            return;
        }
        try {
            const res = await api.get(`/master/companies/${companyId}/departments`);
            setDepartments(
                res.data || []);
        } catch (err) {
            console.error(err);
            setDepartments([]);
        };
    };

    const loadUsers = useCallback(async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
            setUsers([]);
        }
    }, []);

    const createUser = async () => {
        try {
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
            await loadUsers();
            closeModal();
            alert("User created successfully");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed");
        };
    };

    const editUser = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            company_id: user.company?.id || "",
            department_id: user.department?.id || ""
        });
        setShowCreate(true);
        loadDepartments(user.company?.id);
    };

    const updateUser = async () => {
        try {
            const payload = {
                name: form.name,
                email: form.email,
                role: form.role,
                department_id:
                    form.role === "auditee"
                        ? form.department_id
                        : null,
            };
            await api.put(
                `/users/${editingUser.id}`,
                payload
            );
            await loadUsers();
            closeModal();
            alert("Updated");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed");
        }
    };

    const openResetPassword = (
        user
    ) => {
        setSelectedUser(user);
        setNewPassword("");
        setShowResetPassword(true);
    };

    const resetPassword = async () => {
        if (newPassword.length < 6) {
            return alert("Password minimal 6 karakter");
        }
        try {
            await api.post(
                `/users/${selectedUser.id}/reset-password`,
                {
                    password: newPassword
                }
            );

            alert("Password updated");

            setShowResetPassword(false);
            setSelectedUser(null);
            setNewPassword("");

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed");
        }
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
            await loadUsers();
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
        setForm(initialForm);
        setDepartments([]);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([loadUsers(), loadCompanies()]);
        };

        loadInitialData();
    }, [loadUsers, loadCompanies]);


    return {
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
    };
}

