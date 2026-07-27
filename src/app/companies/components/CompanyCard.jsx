"use client";

import {
    Building2,
    Pencil,
    Trash2,
    FolderKanban,
} from "lucide-react";

import { formatDate } from "@/utils/date";

export default function CompanyCard({
    onManage,
    company,
    onEdit,
    onDelete,
}) {

    return (


        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">

                <Building2
                    size={28}
                    className="text-slate-700"
                />

            </div>

            <h3 className="mt-5 text-xl font-semibold">

                {company.name}

            </h3>

            <div className="mt-5 space-y-3">

                <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                        Audit Projects
                    </span>

                    <span className="flex items-center gap-1 font-semibold">

                        <FolderKanban size={15} />

                        {company.audit_projects_count ?? 0}

                    </span>

                </div>

                <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                        Created
                    </span>

                    <span>

                        {formatDate(company.created_at)}

                    </span>

                </div>

            </div>

            <div className="flex gap-3 mt-8">

                <button
                    onClick={() => onManage(company)}
                    className="flex-1 rounded-xl bg-slate-900 text-white py-2.5 hover:bg-slate-800 transition"
                >
                    Departments
                </button>

                <button
                    onClick={() => onEdit(company)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 hover:bg-slate-50 transition flex items-center justify-center gap-2"
                >

                    <Pencil size={16} />

                    Edit

                </button>

                <button
                    onClick={() => onDelete(company)}
                    className="flex-1 rounded-xl border border-red-200 text-red-600 py-2.5 hover:bg-red-50 transition flex items-center justify-center gap-2"
                >

                    <Trash2 size={16} />

                    Delete

                </button>

            </div>

        </div>

    );

}