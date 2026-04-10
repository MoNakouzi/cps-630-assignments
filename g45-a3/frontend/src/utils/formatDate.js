export default function formatDateToToronto(dateStr) {
    // Handle empty or invalid date strings gracefully
    if (!dateStr) {
        return "";
    }

    // Parse the date string into a Date object
    const d = new Date(dateStr);

    // If time is invalid, return empty string
    if (Number.isNaN(d.getTime())) {
        return "";
    }

    // Use en-CA to produce YYYY-MM-DD and ensure America/Toronto timezone
    try {
        return d.toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
    } catch (e) {
        // Fallback: build YYYY-MM-DD manually using UTC values shifted by timezone offset
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
}
