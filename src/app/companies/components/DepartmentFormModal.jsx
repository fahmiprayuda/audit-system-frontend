"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { X, Building2 } from "lucide-react";

import { generateCode } from "@/utils/codeGenerator";

export default function DepartmentFormModal({
    open,
    onClose,
    company,
    department,
    onSuccess,
}) {

    const [loading, setLoading] =
        useState(false);

    const [codeTouched, setCodeTouched] =
        useState(false);

    const [form, setForm] =
        useState({
            code: "",
            name: "",
        });

    useEffect(() => {

        if (!open) return;

        if (department) {

            setForm({

                code: department.code,

                name: department.name,

            });

            setCodeTouched(true);

        } else {

            setForm({

                code: "",

                name: "",

            });

            setCodeTouched(false);

        }

    }, [open, department]);

    const save = async () => {

        try {

            setLoading(true);

            if (department) {

                await api.put(

                    `/master/departments/${department.id}`,

                    form

                );

            } else {

                await api.post(

                    `/master/companies/${company.id}/departments`,

                    form

                );

            }

            onSuccess();

            onClose();

        } catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ??

                "Failed to save department."

            );

        } finally {

            setLoading(false);

        }

    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative w-[520px] bg-white rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between px-8 py-6 border-b">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">

                            <Building2
                                size={28}
                                className="text-slate-700"
                            />

                        </div>

                        <div>

                            <p className="text-xs uppercase tracking-widest text-slate-400">
                                Manage Departments
                            </p>

                            <h2 className="text-2xl font-bold mt-1">
                                {department
                                    ? "Edit Department"
                                    : "Add Department"}
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                {company?.name}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                    >

                        <X size={20} />

                    </button>

                </div>


                <div className="p-8 space-y-6">

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-600">
                            Name
                        </label>

                        <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="Department Name"
                            value={form.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setForm(prev => ({

                                    ...prev,

                                    name,

                                    code: codeTouched
                                        ? prev.code
                                        : generateCode(name),

                                }));

                            }}
                        />
                    </div>

                    <div>

                        <label className="block mb-2 text-sm font-medium text-slate-600">
                            Code
                        </label>

                        <input
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="Department Code"
                            value={form.code}
                            onChange={(e) => {
                                setCodeTouched(true);
                                setForm(prev => ({
                                    ...prev,
                                    code: e.target.value
                                        .toUpperCase()
                                        .replace(/\s/g, ""),
                                }));
                            }}
                        />
                        <p className="mt-2 text-xs text-slate-400">
                            Used as the department identifier, example: FIN, HR, QA, IT
                        </p>

                    </div>

                </div>

                <div className="flex justify-end gap-3 px-8 py-6 border-t">

                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={
                            loading ||
                            !form.name.trim()
                        }
                        onClick={save}
                        className="px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : department
                                ? "Update"
                                : "Create"}
                    </button>

                </div>

            </div>
        </div>
    )
}