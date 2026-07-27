"use client";

import { ArrowLeft, Building2, FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";

export default function FindingHeader({ project }) {

    const router = useRouter();

    return (

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            {/* Top */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* Title */}

            <div className="mt-6">
                <h1 className="text-3xl font-bold text-slate-900">
                    Create Finding
                </h1>
                <p className="mt-2 text-slate-500">
                    Create a new audit finding for this project.
                </p>
            </div>

            {/* Project Info */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">

                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <FolderKanban
                            size={22}
                            className="text-slate-700"
                        />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Project
                        </p>
                        <h3 className="font-semibold text-lg text-slate-900">
                            {project?.project_code}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {project?.project_name}
                        </p>
                    </div>

                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">

                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Building2
                            size={22}
                            className="text-slate-700"
                        />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Company
                        </p>
                        <h3 className="font-semibold text-lg text-slate-900">
                            {project?.company?.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {formatDate(project?.release_date)}
                        </p>
                    </div>

                </div>

            </div>

        </div>

    );

}