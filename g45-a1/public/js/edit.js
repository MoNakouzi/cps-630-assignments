document.addEventListener("DOMContentLoaded", () => {
    // Get the `id` from the URL query string (e.g. /edit?id=2)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const form = document.getElementById("edit-bulletin-form");
    const titleInput = document.getElementById("title");
    const categoryInput = document.getElementById("category");
    const messageInput = document.getElementById("message");
    const authorInput = document.getElementById("author");
    const idInput = document.getElementById("bulletin-id");

    if (!form || !titleInput || !categoryInput || !authorInput || !idInput) {
        console.error("Edit form elements missing from page.");
        alert("Edit page is missing required form fields.");
        window.location.href = "/";
        return;
    }

    // If no id is provided alert and go back to home page
    if (!id) {
        alert("No bulletin id provided.");
        window.location.href = "/";
        return;
    }

    // Load bulletin details for confirmation preview
    fetch(`/api/bulletins/id/${id}`)
        .then((res) => {
            if (!res.ok) throw new Error("Bulletin not found");
            return res.json();
        })
        .then((data) => {
            idInput.value = data.id;
            titleInput.value = data.title || "";
            categoryInput.value = data.category || "Other";
            messageInput.value = data.message || "";
            authorInput.value = data.author || "";
        })
        .catch((err) => {
            console.error("Error loading bulletin:", err);
            alert("Failed to load bulletin. It may not exist anymore.");
            window.location.href = "/";
        });

    // Handle the form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            title: titleInput.value,
            category: categoryInput.value,
            message: messageInput.value,
            author: authorInput.value,
        };

        try {
            const res = await fetch(`/api/bulletins/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            let data = {};
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            if (!res.ok) {
                alert(data.error || "Failed to update bulletin");
                return;
            }

            alert("Bulletin edited successfully!")
            window.location.href = "/";
        } catch (err) {
            console.error("Error updating bulletin:", err);
            alert("Network/server error while updating. Please try again.");
        }
    });
});
