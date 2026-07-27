"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { Building2 } from "lucide-react";

import DepartmentFormModal from "@/app/companies/components/DepartmentFormModal";

export default function DepartmentModal({
    open,
    onClose,
    company,
}) {


    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const deleteDepartment = async (department) => {

        if (
            !confirm(
                `Delete department "${department.name}"?`
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/master/departments/${department.id}`
            );

            fetchDepartments();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ??
                "Failed to delete department."
            );

        }

    };

    const fetchDepartments = async () => {

        if (!company) return;

        try {

            setLoading(true);

            const res = await api.get(
                `/master/companies/${company.id}/departments`
            );

            setDepartments(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (open) {
            fetchDepartments();
        }

    }, [open, company]);

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative w-[900px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col">

                <div className="flex items-center justify-between px-8 py-6 border-b">

                    <div>

                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Company
                        </p>

                        <h2 className="text-2xl font-bold mt-1">
                            {company?.name}
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Manage Departments • {departments.length} Department{departments.length !== 1 ? "s" : ""}
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            setSelectedDepartment(null);
                            setShowForm(true);
                        }}
                        className="px-5 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-800"
                    >
                        + Add Department
                    </button>

                </div>

                <div className="flex-1 overflow-y-auto p-8">

                    {/* Loading */}
                    {loading && (
                        <div className="py-20 text-center">
                            Loading...
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && departments.length === 0 && (

                        <div className="py-20 text-center">

                            <Building2
                                size={42}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-5 text-xl font-semibold">
                                No Departments
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Create your first department.
                            </p>

                        </div>

                    )}

                    {/* Department List */}
                    {!loading && departments.length > 0 && (

                        <div className="space-y-4">

                            {departments.map((dept) => (

                                <div
                                    key={dept.id}
                                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex items-center justify-between hover:bg-slate-100 transition"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="px-3 py-1 rounded-lg bg-slate-700 text-white text-sm font-semibold">
                                            {dept.code}
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                {dept.name}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex gap-2">

                                        <button
                                            onClick={() => {
                                                setSelectedDepartment(dept);
                                                setShowForm(true);
                                            }}
                                            className="px-4 py-2 rounded-xl border hover:bg-white"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteDepartment(dept)}
                                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                <div className="border-t px-8 py-5 flex justify-end">

                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border hover:bg-slate-100"
                    >
                        Close
                    </button>

                </div>

            </div>

            <DepartmentFormModal
                open={showForm}
                company={company}
                department={selectedDepartment}
                onClose={() => {
                    setShowForm(false);
                    setSelectedDepartment(null);
                }}
                onSuccess={() => {
                    fetchDepartments();
                }}
            />

        </div>

    );

}