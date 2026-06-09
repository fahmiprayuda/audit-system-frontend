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

export function timeAgo(date) {

    const seconds =
        Math.floor(
            (new Date() - new Date(date)) / 1000
        );

    const intervals = [
        { label: "year", value: 31536000 },
        { label: "month", value: 2592000 },
        { label: "day", value: 86400 },
        { label: "hour", value: 3600 },
        { label: "minute", value: 60 }
    ];

    for (const i of intervals) {

        const count =
            Math.floor(seconds / i.value);

        if (count >= 1) {
            return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
        }
    }

    return "Just now";
}