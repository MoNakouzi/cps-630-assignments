document.addEventListener("DOMContentLoaded", async () => {
    const preview = document.getElementById("bulletinPreview");
    const confirmBtn = document.getElementById("confirmDelete");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        preview.textContent = "No bulletin id provided.";
        confirmBtn.disabled = true;
        confirmBtn.classList.add("opacity-50", "cursor-not-allowed");
        return;
    }

    // Load bulletin details for confirmation preview
    try {
        const res = await fetch(`/api/bulletins/id/${id}`);
        if (!res.ok) throw new Error("Not found");
        const b = await res.json();

        preview.innerHTML = `
            <div class="font-semibold">${b.title}</div>
            <div class="mt-1 text-slate-600">${b.message || ""}</div>
            <div class="mt-2 text-xs text-slate-500">
                <span>${b.category}</span> • <span>${b.author}</span> • <span>${b.date}</span>
            </div>
        `;
    } catch (err) {
        console.error("Error loading bulletin:", err);
        preview.textContent = "Bulletin not found.";
        confirmBtn.disabled = true;
        confirmBtn.classList.add("opacity-50", "cursor-not-allowed");
        alert("Bulletin not found.");
        return;
    }

    // Delete on confirm
    confirmBtn.addEventListener("click", async () => {
        try {
            const res = await fetch(`/api/bulletins/${id}`, {
                method: "DELETE",
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                alert(data.error || "Failed to delete post.");
                return;
            }

            alert("Bulletin deleted successfully!");
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Network/server error while deleting. Please try again.");
        }
    });
});
