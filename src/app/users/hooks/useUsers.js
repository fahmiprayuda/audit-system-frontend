"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";

export default function useUsers() {
    const toast = useToast();
    const initialForm = {
        name: "",
        email: "",
        password: "",
        role: "auditee",
        level: "Staff",
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
                level: form.level || null,
                department_id:
                    form.role === "auditee"
                        ? form.department_id
                        : null,
            };
            await api.post("/users", payload);
            await loadUsers();
            closeModal();
            toast.success("User created successfully");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create user");
        };
    };

    const editUser = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            level: user.level || "",
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
                level: form.level || null,
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
            toast.success("User updated successfully");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update user");
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
            return toast.warning("Password must be at least 6 characters");
        }
        try {
            await api.post(
                `/users/${selectedUser.id}/reset-password`,
                {
                    password: newPassword
                }
            );

            toast.success("Password reset successfully");

            setShowResetPassword(false);
            setSelectedUser(null);
            setNewPassword("");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to reset password");
        }
    };

    const deleteUser = async (id) => {
        try {
            const res = await api.delete(`/users/${id}`);
            toast.success(res.data?.message || "User deleted successfully");
            await loadUsers();
            return true;
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to delete user"
            );
            return false;
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

