import { useState, useEffect } from "react";
import CategorySelect from "../components/bulletinList/CategorySelect";
import BulletinGrid from "../components/bulletinList/BulletinGrid";
import SearchBulletins from "../components/bulletinList/SearchBulletins";
import API_BASE_URL from "../config";

export default function BulletinList() {
    const [bulletins, setBulletins] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("any");

    // On initial load, fetch bulletins from the backend and populate the grid
    useEffect(() => {
        async function fetchBulletins() {
            try {
                const params = new URLSearchParams();

                if (selectedCategory !== "all") {
                    params.append("category", selectedCategory);
                }

                if (searchTerm.trim()) {
                    params.append("q", searchTerm.trim());
                    params.append("field", searchField);
                }

                let url = `${API_BASE_URL}/api/bulletins`;

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch bulletins");
                }

                const bulletins = await response.json();
                setBulletins(bulletins);
            } catch (error) {
                console.error("Error fetching bulletins:", error);
                setBulletins([]);
            }
        }

        fetchBulletins();
    }, [selectedCategory, searchTerm, searchField]);

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 min-h-screen pb-10">
            <section className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Bulletin Board
                </h1>
                <p className="mt-2 text-sm text-slate-700 max-w-2xl">
                    Our campus bulletin board items! Browse through the latest
                    announcements, events, and more.
                </p>
            </section>

            <div className="flex flex-col gap-4 justify-center mb-6">
                <CategorySelect
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <SearchBulletins
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    searchField={searchField}
                    onSearchFieldChange={setSearchField}
                />
            </div>

            {bulletins.length > 0 ? (
                <BulletinGrid bulletins={bulletins} />
            ) : (
                <section className="my-auto rounded-xl border border-violet-300 bg-white/80 p-10 text-center">
                    <h3 className="text-sm font-semibold">
                        No bulletins found
                    </h3>
                    <p className="mt-1 text-sm text-violet-600">
                        We either have no data or your search didn't match any
                        bulletins. Try adjusting your filters or search terms.
                    </p>
                </section>
            )}
        </main>
    );
}
