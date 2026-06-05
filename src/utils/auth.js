export function getUser() {
    if (typeof window === "undefined")
        return null;

    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
}

export function canManageActionPlan() {
    const user = getUser();

    return ["admin", "auditor"].includes(user?.role);
}

export function canDeleteFinding() {
    const user = getUser();

    return user?.role === "admin";
}

export function canApproveActionPlan() {
    const user = getUser();

    return ["admin", "auditor"].includes(user?.role);
}

export function isAdmin() {
    return getUser()?.role === "admin";
}

export function isAuditor() {
    return getUser()?.role === "auditor";
}

export function isAuditee() {
    return getUser()?.role === "auditee";
}
