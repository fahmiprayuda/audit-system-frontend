import {
    Clock3,
    FilePlus2,
    RefreshCcw,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";

export const LABEL = {
    new: "New Action Plan",
    revision: "Revision Required",
    waiting: "Waiting Review",
    site: "Site Validation",
    overdue: "Overdue",
};

export const COLOR = {
    new: "bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-500/10",
    revision: "bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/10",
    waiting: "bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-1 ring-indigo-500/10",
    site: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/10",
    overdue: "bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/10",
};

export const ICONS = {
    new: FilePlus2,
    revision: RefreshCcw,
    waiting: Clock3,
    site: ShieldCheck,
    overdue: AlertTriangle,
};

export default function WorkflowBadge({ queue }) {
    const label = LABEL[queue] || queue || "Unknown";
    const color = COLOR[queue] || "bg-slate-50 text-slate-700 border-slate-200";
    const Icon = ICONS[queue];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}
        >
            {Icon && <Icon size={12} className="shrink-0" />}
            <span>{label}</span>
        </span>
    );
}