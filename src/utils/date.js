export function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
}

export function formatDateTime(date) {
    if (!date) return "";

    return new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}