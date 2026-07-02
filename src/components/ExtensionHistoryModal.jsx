"use client";

import { X } from "lucide-react";
import { formatDate, formatDateTime } from "@/utils/date";
import {
    STATUS_LABEL,
    STATUS_COLOR,
} from "@/constants/findingStatus";

export default function ExtensionHistoryModal({
    open,
    onClose,
    extensions = [],
}) {

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-[700px] max-h-[80vh] overflow-hidden"
            >

                {/* Header */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-xl font-bold">
                            Extension History
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Timeline of all Action Plan extensions
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="overflow-y-auto max-h-[65vh] p-8">

                    {extensions.length === 0 ? (

                        <div className="text-center py-16">

                            <div className="text-5xl mb-4">
                                🗂
                            </div>

                            <h3 className="font-semibold text-lg">
                                No Extension History
                            </h3>

                            <p className="text-slate-500 mt-2">
                                This Action Plan has never been extended.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-10">

                            {extensions.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex gap-6"
                                >

                                    {/* Timeline */}

                                    <div className="flex flex-col items-center">

                                        <div className="w-4 h-4 rounded-full bg-blue-600" />

                                        <div className="w-px flex-1 bg-slate-300 mt-2" />

                                    </div>

                                    {/* Content */}

                                    <div className="flex-1 pb-10 border-b">

                                        <h3 className="font-semibold text-lg">
                                            Extended
                                        </h3>

                                        <div className="mt-4 space-y-3">

                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Due Date
                                                </p>

                                                <p className="font-medium">
                                                    {formatDate(item.old_due_date)}

                                                    <span className="mx-3 text-slate-400">
                                                        →
                                                    </span>

                                                    {formatDate(item.new_due_date)}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Status After Extension
                                                </p>

                                                <span
                                                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[item.status_after_extension]}`}
                                                >
                                                    {STATUS_LABEL[item.status_after_extension]}
                                                </span>

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Reason
                                                </p>

                                                <p className="mt-1">
                                                    {item.reason}
                                                </p>

                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mt-4">

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Extended By
                                                    </p>

                                                    <p className="font-medium">
                                                        {item.extended_by}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Date
                                                    </p>

                                                    <p>
                                                        {formatDateTime(item.created_at)}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );

}