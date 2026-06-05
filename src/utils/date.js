export function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function formatDateTime(date) {
    if (!date) return "";

    const d = new Date(date);

    const datePart = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${datePart}, ${hours}:${minutes}`;
}

export function formatShortDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
}