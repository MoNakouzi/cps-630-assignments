import { useState, useEffect, use } from "react";
import CategorySelect from "../components/bulletinList/CategorySelect";
import BulletinGrid from "../components/bulletinList/BulletinGrid";
import API_BASE_URL from "../config";

export default function BulletinList() {
    const [bulletins, setBulletins] = useState([]);

    // On initial load, fetch bulletins from the backend and populate the grid
    useEffect(() => {
        async function fetchBulletins() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/bulletins`);
                const bulletins = await response.json();
                console.log("Fetched bulletins:", bulletins);
                setBulletins(bulletins);
            } catch (error) {
                console.error("Error fetching bulletins:", error);
            }
        }
        fetchBulletins();
    }, []);

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 min-h-screen pb-10">
            <section className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Main Board
                </h1>
                <p className="mt-2 text-sm text-slate-700 max-w-2xl">
                    Our campus bulletin board items! Browse through the latest
                    announcements, events, and more.
                </p>
            </section>

            <CategorySelect />

            {bulletins.length > 0 ? (
                <BulletinGrid bulletins={bulletins} />
            ) : (
                <section
                    id="emptyState"
                    className="hidden my-auto rounded-xl border border-violet-300 bg-white/80 p-10 text-center"
                >
                    <h3 className="text-sm font-semibold">No bulletins found</h3>
                    <p className="mt-1 text-sm text-violet-600">
                        You might need to pick a different category.
                    </p>
                </section>
            )}
        </main>
    );
}
