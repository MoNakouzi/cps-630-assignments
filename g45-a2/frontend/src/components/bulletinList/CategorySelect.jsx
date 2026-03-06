import { useState, useEffect } from "react";
import { IoFilterOutline } from "react-icons/io5";
import API_BASE_URL from "../../config";

export default function CategorySelect() {
    const [categories, setCategories] = useState([1, 2, 3]);

    // On initial load, fetch categories from the backend and populate the dropdown
    useEffect(() => {
        async function fetchCategories() {
            // try {
            //     const response = await fetch(`${API_BASE_URL}/api/bulletins/categories`);
            //     const categories = await response.json();
            //     setCategories(categories);
            // } catch (error) {
            //     console.error("Error fetching categories:", error);
            // }
        }
        fetchCategories();
    }, []);

    return (
        <section className="bg-white border border-violet-200 rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-violet-500 font-semibold">
                    <label
                        htmlFor="categorySelect"
                        className="text-sm font-medium text-slate-700 flex items-center"
                    >
                        <IoFilterOutline className="inline-block mr-2" />
                        Category
                    </label>
                    <select
                        id="categorySelect"
                        className="rounded-lg min-w-24 border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                    >
                        {/* add an "All" default option */}
                        <option value="all">All</option>

                        {/* Map over the fetched categories */}
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="text-xs font-semibold text-violet-500">
                    Tip: Click “Add Item” to post a new bulletin.
                </p>
            </div>
        </section>
    );
}
