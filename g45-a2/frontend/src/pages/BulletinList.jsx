import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoAdd, IoCalendarOutline, IoArrowForward } from "react-icons/io5";

export default function BulletinList() {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBulletins = async () => {
            try {
                const response = await fetch("http://localhost:8080/bulletins");
                if (!response.ok) {
                    throw new Error(`Failed to fetch bulletins: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setBulletins(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBulletins();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-violet-600 text-xl font-semibold animate-pulse">Loading board...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="text-red-500 text-xl font-semibold">Error: {error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-violet-100 p-6 sm:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Bulletin Board</h1>
                        <p className="text-slate-500 mt-2">Latest updates and announcements</p>
                    </div>
                    <Link
                        to="/create"
                        className="inline-flex items-center px-5 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition shadow-lg hover:shadow-violet-200"
                    >
                        <IoAdd className="mr-2 text-xl" />
                        Create New
                    </Link>
                </div>

                {bulletins.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-violet-100">
                        <p className="text-slate-400 text-lg">No bulletins found. Be the first to post!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bulletins.map((bulletin) => (
                            <Link 
                                key={bulletin.id || bulletin._id} 
                                to={`/bulletins/${bulletin.id || bulletin._id}`}
                                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-violet-100 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                                        {bulletin.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                        <IoCalendarOutline />
                                        <span>
                                            {bulletin.date 
                                                ? new Date(bulletin.date).toLocaleDateString() 
                                                : (bulletin.created_at ? new Date(bulletin.created_at).toLocaleDateString() : new Date().toLocaleDateString())}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                                    {bulletin.message || bulletin.content || bulletin.description || "No preview available."}
                                </p>

                                <div className="flex items-center text-violet-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    Read More <IoArrowForward className="ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
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
                        Please adjust your search value to see more results.
                    </p>
                </section>
            )}
        </main>
    );
}
