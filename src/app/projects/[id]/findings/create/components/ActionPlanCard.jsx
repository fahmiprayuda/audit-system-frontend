"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    ClipboardCheck,
    Calendar,
    Building2,
} from "lucide-react";

export default function ActionPlanCard({

    departments,

    selectedDepartments,

    actionPlans,

    handleAPChange,

}) {

    if (selectedDepartments.length === 0)
        return null;

    return (
        <>
            <div className="p-8">

                {/* Header */}

                <div className="flex items-center gap-4 mb-8">

                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                        <ClipboardCheck
                            size={22}
                            className="text-slate-700"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            Action Plans

                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            Complete the action plan for every selected department.

                        </p>

                    </div>

                </div>

                <div className="space-y-6">

                    {selectedDepartments.map((deptId) => {

                        const dept =
                            departments.find(
                                d => String(d.id) === deptId
                            );

                        const ap =
                            actionPlans[deptId];

                        return (

                            <div
                                key={deptId}
                                className="rounded-2xl border border-slate-200 p-6"
                            >

                                {/* Department */}

                                <div className="flex items-center gap-3 mb-6">

                                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                                        <Building2
                                            size={20}
                                            className="text-slate-700"
                                        />

                                    </div>

                                    <div>

                                        <p className="text-xs uppercase tracking-widest text-slate-400">

                                            {dept?.code}

                                        </p>

                                        <h3 className="font-semibold text-lg">

                                            {dept?.name}

                                        </h3>

                                    </div>

                                </div>

                                {/* Root Cause */}

                                <div className="mb-5">

                                    <label className="block text-sm font-medium mb-2">

                                        Root Cause

                                    </label>

                                    <textarea

                                        rows={3}

                                        value={ap?.root_cause || ""}

                                        onChange={(e) =>

                                            handleAPChange(

                                                deptId,

                                                "root_cause",

                                                e.target.value

                                            )

                                        }

                                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 resize-none focus:ring-2 focus:ring-slate-900 focus:outline-none"

                                        placeholder="Describe the root cause..."

                                    />

                                </div>

                                {/* Corrective */}

                                <div className="mb-5">

                                    <label className="block text-sm font-medium mb-2">

                                        Corrective Action

                                    </label>

                                    <textarea

                                        rows={4}

                                        value={ap?.corrective_action || ""}

                                        onChange={(e) =>

                                            handleAPChange(

                                                deptId,

                                                "corrective_action",

                                                e.target.value

                                            )

                                        }

                                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 resize-none focus:ring-2 focus:ring-slate-900 focus:outline-none"

                                        placeholder="Describe the corrective action..."

                                    />

                                </div>

                                {/* Due Date */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">

                                        Due Date

                                    </label>

                                    <div className="relative">

                                        <Calendar
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                                        />

                                        <DatePicker

                                            selected={ap?.due_date}

                                            onChange={(date) =>

                                                handleAPChange(

                                                    deptId,

                                                    "due_date",

                                                    date

                                                )

                                            }

                                            dateFormat="dd/MM/yyyy"

                                            placeholderText="Select due date"

                                            className="w-full rounded-2xl border border-slate-300 pl-11 pr-4 py-3 focus:ring-2 focus:ring-slate-900 focus:outline-none"

                                        />

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

            <div className="mb-20" />
        </>
    );

}