"use client";

import {
    Pencil,
    Trash2,
    Building2,
} from "lucide-react";

import { formatDate } from "@/utils/date";

export default function CompanyTable({
    companies,
    loading,
    onEdit,
    onDelete,
}) {

    return (

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

            <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Company
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Created
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {loading && (

                        <tr>

                            <td
                                colSpan={3}
                                className="py-20 text-center text-slate-400"
                            >
                                Loading...
                            </td>

                        </tr>

                    )}

                    {!loading &&
                        companies.length === 0 && (

                            <tr>

                                <td
                                    colSpan={3}
                                    className="py-20 text-center text-slate-400"
                                >
                                    No companies found.
                                </td>

                            </tr>

                        )}

                    {!loading &&
                        companies.map(company => (

                            <tr
                                key={company.id}
                                className="border-b last:border-0 hover:bg-slate-50 transition"
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                                            <Building2
                                                size={20}
                                                className="text-slate-600"
                                            />

                                        </div>

                                        <div>

                                            <p className="font-semibold text-slate-800">
                                                {company.name}
                                            </p>

                                            <p className="text-sm text-slate-400">
                                                ID #{company.id}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-slate-500">

                                    {formatDate(company.created_at)}

                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={() =>
                                                onEdit(company)
                                            }
                                            className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center"
                                        >

                                            <Pencil size={18} />

                                        </button>

                                        <button
                                            onClick={() =>
                                                onDelete(company)
                                            }
                                            className="w-10 h-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center"
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                </tbody>

            </table>

        </div>

    );

}