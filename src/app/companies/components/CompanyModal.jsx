"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { X, Building2 } from "lucide-react";
import { generateCompanyCode } from "@/utils/companyCode";

export default function CompanyModal({
    open,
    onClose,
    company,
    onSuccess,
}) {


    const [loading, setLoading] = useState(false);

    const [codeTouched, setCodeTouched] = useState(false);

    const [checking, setChecking] = useState(false);

    const [available, setAvailable] = useState(null);

    const [form, setForm] = useState({
        code: "",
        name: "",
    });

    useEffect(() => {

        if (!open) return;

        if (company) {

            setForm({
                code: company.code,
                name: company.name,
            });

            setCodeTouched(true);

        } else {

            setForm({
                code: "",
                name: "",
            });

            setCodeTouched(false);

        }

    }, [open, company]);

    useEffect(() => {

        if (!open || form.code.length < 2) {

            setAvailable(null);
            return;

        }

        const timer = setTimeout(async () => {

            try {

                const res = await api.get(
                    "/master/companies/check-code",
                    {
                        params: {
                            code: form.code,
                            ignore: company?.id,
                        },
                    }
                );

                setAvailable(res.data.available);

            } catch (err) {

                console.error(err);

                setAvailable(null);

            }

        }, 500);

        return () => clearTimeout(timer);

    }, [form.code, open, company]);

    if (!open) return null;

    const save = async () => {

        try {

            setLoading(true);

            if (company) {

                await api.put(
                    `/master/companies/${company.id}`,
                    form
                );

            } else {

                await api.post(
                    "/master/companies",
                    form
                );

            }

            onSuccess();
            onClose();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ??
                "Failed to save company."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Backdrop */}

            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal */}

            <div className="relative w-[520px] bg-white rounded-3xl shadow-2xl">

                {/* Header */}

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
                                Master Data
                            </p>

                            <h2 className="text-2xl font-bold">

                                {company
                                    ? "Edit Company"
                                    : "Add Company"}

                            </h2>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                    >

                        <X size={20} />

                    </button>

                </div>

                {/* Body */}

                <div className="p-8 space-y-6">

                    <div>

                        <label className="block mb-2 text-sm font-medium text-slate-600">
                            Company Name
                        </label>

                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setForm(prev => ({
                                    ...prev,
                                    name,
                                    code: codeTouched ? prev.code : generateCompanyCode(name),
                                }));
                            }}
                            placeholder="Enter company name..."
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 text-sm font-medium text-slate-600">
                            Company Code
                        </label>

                        <input
                            type="text"
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
                            placeholder="Enter company code..."
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        {checking && (

                            <p className="text-slate-400 mt-2">

                                Checking...

                            </p>

                        )}

                        {!checking && available === true && (

                            <p className="text-green-600 mt-2">

                                ✓ Company code available

                            </p>

                        )}

                        {!checking && available === false && (

                            <p className="text-red-600 mt-2">

                                Company code already exists

                            </p>

                        )}
                        <p className="mt-2 text-xs text-slate-400">
                            Used to generate Project Code.
                            Example:
                            AUD-{form.code || "FKS"}-2026-001
                        </p>

                    </div>


                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 px-8 py-6 border-t">

                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 transition"
                    >

                        Cancel

                    </button>

                    <button
                        disabled={loading || !form.name.trim()}
                        onClick={save}
                        className="px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                    >

                        {loading
                            ? "Saving..."
                            : company
                                ? "Update Company"
                                : "Create Company"}

                    </button>

                </div>

            </div>

        </div>

    );

}