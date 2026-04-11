import { useEffect, useState } from "react";
import formatDateToToronto from "../../utils/formatDate";
import API_BASE_URL from "../../config";

export default function BulletinFormFields({
    formData,
    onInputChange,
    showDate = false,
    currentUser = null,
}) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async function load() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/categories`);
                if (!res.ok) return;
                const data = await res.json();
                if (mounted) setCategories(data);
            } catch (e) {
                // ignore load errors here; form will still work with manual entry
                console.warn("Could not load categories:", e);
            }
        })();
        return () => (mounted = false);
    }, []);
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Title <span className="text-red-600">*</span>
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter bulletin title"
                />
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Category <span className="text-red-600">*</span>
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category || ""}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                >
                    <option value="" disabled>
                        Select a category
                    </option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">Choose a category from the list.</p>
            </div>

            <div className="sm:col-span-2">
                <label htmlFor="visibility" className="mb-2 block text-sm font-semibold text-slate-800">
                    Visibility
                </label>
                <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility || "public"}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                >
                    <option value="public" className="py-2">Public (visible to everyone)</option>
                    <option value="private" className="py-2">Private (only you and admins)</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">Private bulletins can only be viewed by you and admins.</p>
            </div>

            <div>
                <label
                    htmlFor="author"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Author {currentUser ? <span className="text-xs text-slate-500">(your account)</span> : <span className="text-red-600">*</span>}
                </label>
                {currentUser ? (
                    <input
                        id="author"
                        name="author"
                        type="text"
                        value={currentUser.name || formData.author}
                        disabled
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 cursor-not-allowed"
                    />
                ) : (
                    <input
                        id="author"
                        name="author"
                        type="text"
                        value={formData.author}
                        onChange={onInputChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="Author name"
                    />
                )}
            </div>

            <div className="sm:col-span-2">
                <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows="7"
                    value={formData.message}
                    onChange={onInputChange}
                    className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Add bulletin details"
                />
            </div>

            {showDate && (
                <div className="sm:col-span-2">
                    <label
                        htmlFor="date"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                        Last Updated Date
                    </label>
                    <input
                        disabled
                        id="date"
                        className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
                        value={formatDateToToronto(formData.date) || "No date available"}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        Date is maintained by the backend and will refresh after
                        saving.
                    </p>
                </div>
            )}
        </div>
    );
}
