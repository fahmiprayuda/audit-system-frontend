"use client";

import { Building2, Check } from "lucide-react";

export default function DepartmentSelector({
    departments,
    selectedDepartments,
    toggleDepartment,
}) {

    return (
        <>
            <div className="p-8">

                {/* Header */}

                <div className="flex items-center gap-4 mb-8">

                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                        <Building2
                            size={22}
                            className="text-slate-700"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Responsible Departments
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Select one or more departments responsible for this finding.
                        </p>

                    </div>

                </div>

                {/* Empty */}

                {departments.length === 0 && (

                    <div className="border border-dashed rounded-2xl p-10 text-center">

                        <p className="text-slate-500">

                            No departments available.

                        </p>

                    </div>

                )}

                {/* Grid */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                    {departments.map((dept) => {

                        const selected =
                            selectedDepartments.includes(
                                String(dept.id)
                            );

                        return (

                            <button
                                key={dept.id}
                                type="button"
                                onClick={() => toggleDepartment(dept.id)}
                                className={`
                                relative
                                rounded-2xl
                                border
                                p-5
                                text-left
                                transition-all
                                duration-200

                                ${selected
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                        : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md"
                                    }
                            `}
                            >

                                {/* Check */}

                                {selected && (

                                    <div className="absolute top-4 right-4">

                                        <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center">

                                            <Check size={16} />

                                        </div>

                                    </div>

                                )}

                                {/* Code */}

                                <p
                                    className={`text-xs uppercase tracking-widest ${selected
                                        ? "text-slate-300"
                                        : "text-slate-400"
                                        }`}
                                >

                                    {dept.code}

                                </p>

                                {/* Name */}

                                <h3 className="mt-3 font-semibold text-lg">

                                    {dept.name}

                                </h3>

                            </button>

                        );

                    })}

                </div>

                {/* Footer */}

                {selectedDepartments.length > 0 && (

                    <p className="mt-6 text-sm text-slate-500">

                        {selectedDepartments.length} department selected.

                    </p>

                )}

            </div>
            <div className="px-8">
                <div className="border-b border-slate-200 mt-8" />
            </div>
        </>
    );

}