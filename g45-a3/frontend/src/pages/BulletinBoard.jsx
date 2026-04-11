import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import CategorySelect from "../components/bulletinList/CategorySelect";
import BulletinGrid from "../components/bulletinList/BulletinGrid";
import SearchBulletins from "../components/bulletinList/SearchBulletins";
import API_BASE_URL from "../config";

export default function BulletinBoard() {
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

                const result = await response.json();

                // API returns { data: [...], total, page, limit }
                const data = result.data ?? result;
                setBulletins(data);
            } catch (error) {
                console.error("Error fetching bulletins:", error);
                setBulletins([]);
            }
        }

        fetchBulletins();
    }, [selectedCategory, searchTerm, searchField]);

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 min-h-screen pb-10 fade-in">
            <section className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Bulletin Board
                </h1>
                <p className="mt-2 text-sm text-slate-700 max-w-2xl">
                    Our campus bulletin board items! Browse through the latest
                    announcements, events, and more. <br />
                    <br />
                    <strong>Note:</strong> If a bulletin was created by another
                    user, you do not have permission to edit or delete it
                    (unless you're an admin).
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
                        bulletins.
                    </p>

                    <div className="mt-4">
                        <p className="text-sm text-slate-600">
                            You can try adjusting filters or creating a new
                            bulletin.
                        </p>
                        <div className="mt-3">
                            <Link
                                to="/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                            >
                                Create Bulletin
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
