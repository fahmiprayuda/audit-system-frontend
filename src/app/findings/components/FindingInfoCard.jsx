"use client";

import { FileText, ShieldAlert } from "lucide-react";

export default function FindingInfoCard({
    form,
    setForm,
}) {

    return (
        <>
            <div className="p-8">

                {/* Header */}

                <div className="flex items-center gap-4 mb-8">

                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                        <FileText
                            size={22}
                            className="text-slate-700"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">

                            Finding Information

                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            Describe the audit finding before assigning departments.

                        </p>

                    </div>

                </div>

                <div className="space-y-6">

                    {/* Finding Title */}

                    <div>

                        <label className="block text-sm font-medium text-slate-600 mb-2">

                            Finding Title

                        </label>

                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            placeholder="Example: No approval workflow for vendor creation"
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3
                        focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />

                    </div>

                    {/* Description */}

                    <div>

                        <label className="block text-sm font-medium text-slate-600 mb-2">

                            Description

                        </label>

                        <textarea
                            rows={5}
                            value={form.description}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Explain the audit finding..."
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3
                        resize-none
                        focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />

                    </div>

                    {/* Risk */}

                    <div>

                        <label className="block text-sm font-medium text-slate-600 mb-2">

                            Risk Rating

                        </label>

                        <div className="relative">

                            <ShieldAlert
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <select
                                value={form.risk}
                                onChange={(e) =>
                                    setForm(prev => ({
                                        ...prev,
                                        risk: e.target.value,
                                    }))
                                }
                                className="w-full rounded-2xl border border-slate-300
                            pl-11 pr-4 py-3
                            appearance-none
                            focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >

                                <option value="Moderate">
                                    Moderate
                                </option>

                                <option value="Major">
                                    Major
                                </option>

                                <option value="Extreme">
                                    Extreme
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            <div className="px-8">
                <div className="border-b border-slate-200 mt-8" />
            </div>
        </>
    );

}