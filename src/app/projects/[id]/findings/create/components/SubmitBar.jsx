"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmitBar({
    loading,
    selectedDepartments,
}) {

    const router = useRouter();

    return (

        <div className="sticky bottom-6 z-20">

            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl px-8 py-5">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* Summary */}

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                            <CheckCircle2
                                size={22}
                                className="text-slate-700"
                            />

                        </div>

                        <div>

                            <p className="font-semibold text-slate-900">

                                Ready to create finding

                            </p>

                            <p className="text-sm text-slate-500">

                                {selectedDepartments.length} department selected

                                {selectedDepartments.length > 0 &&
                                    ` • ${selectedDepartments.length} Action Plan will be created`
                                }

                            </p>

                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() => router.back()}

                            className="px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 transition"

                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                selectedDepartments.length === 0
                            }

                            className="px-8 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"

                        >

                            {loading

                                ? "Creating..."

                                : "Create Finding"}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}