document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-bulletin-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/bulletins", {
                method: "POST",
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
                alert(data.error || "Failed to save bulletin");
                return;
            }
            
            alert("Bulletin added successfully!")
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Network/server error while saving.");
        }
    });
});
