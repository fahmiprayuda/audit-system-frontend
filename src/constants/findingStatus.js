export const STATUS_FLOW = {
    draft: ["submit"],
    need_revision: ["submit"],
    submitted: ["approve", "revision"],
    approved: [],
};

export const STATUS_LABEL = {
    draft: "OPEN",
    submitted: "NEED FURTHER REVIEW",
    need_revision: "NEED FURTHER REVIEW",
    approved: "CLOSED",
};

export const STATUS_COLOR = {
    draft: "bg-slate-100 text-slate-600",
    submitted: "bg-orange-100 text-orange-700",
    need_revision: "bg-orange-100 text-orange-700",
    approved: "bg-emerald-100 text-emerald-700",
};

export const CURRENT_OWNER = {
    draft: "auditee",
    need_revision: "auditee",
    submitted: "auditor",
    approved: null,
};