// Functions that call API routes from src/routes

/***************************************************/
/********* Fetch all Bulletins from API ************/
/***************************************************/
// Global variable to store all bulletins
let allBulletins = [];

// Load all bulletins on page load
document.addEventListener('DOMContentLoaded', function () {
    loadBulletins();

    // Filter by category
    const categorySelect = document.getElementById("categorySelect");

    categorySelect.addEventListener("change", function () {
        const selectedCategory = this.value;

        if (selectedCategory === "all") {
            displayBulletins(allBulletins, 'bulletinGrid', 'emptyState');
        } else {
            const filtered = allBulletins.filter(b =>
                b.category.toLowerCase() === selectedCategory.toLowerCase()
            );
            displayBulletins(filtered, 'bulletinGrid', 'emptyState');
        }
    });
});

// Load all bulletins
async function loadBulletins() {
    try {
        const response = await fetch('/api/bulletins');
        const bulletins = await response.json();

        allBulletins = bulletins;
        displayBulletins(allBulletins, 'bulletinGrid', 'emptyState');
    } catch (error) {
        console.error("Error loading bulletins: ", error);
    }
}

// Show all bulletins
function displayBulletins(bulletins, containerId, emptyStateId) {
    const container = document.querySelector('#' + containerId);
    const emptyContainer = document.querySelector('#' + emptyStateId);

    if (container === null) {
        return;
    }

    if (bulletins.length === 0) {
        container.innerHTML = "";
        emptyContainer.classList.remove("hidden");
        return;
    } else {
        emptyContainer.classList.add("hidden");
    }

    bulletinHTMLStr = '';
    bulletins.map(b => {
        bulletinHTMLStr += `
            <article class="masonry-item rounded-2xl border border-violet-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between gap-3">
                    <h2 class="text-base font-semibold leading-6 text-slate-900">${b.title}</h2>
                    <span
                        class="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100"
                    >
                        ${b.category}
                    </span>
                </div>

                <p class="mt-3 text-sm text-slate-600 leading-6">${b.message}</p>

                <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span class="font-medium text-slate-600">${b.author}</span>
                    <span>${b.date}</span>
                </div>

                <div class="mt-4 flex items-center justify-start gap-3">
                    <a href="/edit?id=${b.id}"
                        class="text-xs rounded-lg bg-violet-500 px-3 py-2 text-white hover:bg-violet-700 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md">
                        Edit
                    </a>
                    <a href="/delete?id=${b.id}"
                        class="text-xs rounded-lg bg-red-400 px-3 py-2 text-white hover:bg-red-600 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md">
                        Delete
                    </a>
                </div>
            </article>
        `
    });

    container.innerHTML = bulletinHTMLStr;
}