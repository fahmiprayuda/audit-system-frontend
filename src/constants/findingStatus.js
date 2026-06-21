export const FLAG_LABEL = {
    submitted: "SUBMITTED",
    revision_required: "REVISION",
    overdue: "⚠️ OVERDUE ⚠️",
    on_site_falidation: "ON SITE VALIDATION",
}

export const FLAG_COLOR = {
    submitted: "bg-blue-100 text-blue-700",
    revision_required: "bg-orange-100 text-orange-700",
    overdue: "bg-red-100 text-red-700",
}

export const STATUS_LABEL = {
    need_further_review: "NFR",
    open: "OPEN",
    closed: "CLOSED",
};

export const STATUS_COLOR = {
    need_further_review: "bg-slate-100 text-slate-600",
    submitted: "bg-orange-100 text-orange-700",
    need_revision: "bg-orange-100 text-orange-700",
    closed: "bg-emerald-100 text-emerald-700",
};

export const CURRENT_OWNER = {
    need_further_review: "auditee",
    need_revision: "auditee",
    submitted: "auditor",
    closed: null,
};