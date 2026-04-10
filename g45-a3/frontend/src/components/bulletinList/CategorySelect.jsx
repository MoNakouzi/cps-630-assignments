import { useState, useEffect } from "react";
import { IoFilterOutline } from "react-icons/io5";
import API_BASE_URL from "../../config";

export default function CategorySelect({selectedCategory, onCategoryChange}) {
    const [categories, setCategories] = useState([]);

    // On initial load, fetch categories from the backend and populate the dropdown
    useEffect(() => {
        async function fetchCategories() {
            try {
                // Fetch categories from the categories API
                const response = await fetch(`${API_BASE_URL}/api/categories`);

                // If the response is not OK, throw an error to be caught below
                if (!response.ok) { 
                    throw new Error("Failed to fetch categories");
                }

                // Parse the JSON response to get the category data
                const categories = await response.json();
                // backend returns array of category objects; map to names for this select
                setCategories(categories.map((c) => c.name));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }

        fetchCategories();
    }, []);

    return (
        <section className="bg-white border border-violet-200 rounded-xl p-4 shadow-sm w-full">
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
                        value={selectedCategory}
                        id="categorySelect"
                        onChange={(e) => onCategoryChange(e.target.value)}
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
