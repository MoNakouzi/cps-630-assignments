import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BulletinLoading from "../components/general/BulletinLoading";

export default function AdminCategories() {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { authFetch } = useAuth();
    const toast = useToast();

    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    async function loadCats() {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            setCats(data);
        } catch (err) {
            console.error(err);
            toast.show(err.message || "Could not load categories", { type: "danger" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCats();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        try {
            const res = await authFetch(`${API_BASE_URL}/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });

            if (!res.ok) {
                const txt = await res.text();
                const msg = txt || "Failed to create category";
                toast.show("Error: " + msg, { type: "danger" });
                throw new Error(msg);
            }

            await loadCats();
            setName("");
            setDescription("");
            toast.show("Category created successfully!", { type: "success" });
        } catch (err) {
            console.error(err);
        }
    }
    function requestDelete(id) {
        setConfirmDeleteId(String(id));
    }

    function cancelDelete() {
        setConfirmDeleteId(null);
    }

    async function performDelete(id) {
        setDeletingId(String(id));
        try {
            const res = await authFetch(
                `${API_BASE_URL}/api/categories/${id}`,
                {
                    method: "DELETE",
                },
            );

            if (!res.ok) {
                // read text then try to parse JSON to extract a message
                let text = await res.text();
                let msg = `Failed to delete (status ${res.status})`;
                try {
                    const parsed = JSON.parse(text);
                    msg =
                        parsed.error ||
                        parsed.message ||
                        JSON.stringify(parsed);
                } catch (_) {
                    // not JSON, use raw text if present
                    if (text && text.trim()) msg = text;
                }

                toast.show("Error: " + msg, { type: "danger" });
                setConfirmDeleteId(null);
                setDeletingId(null);
                return;
            }

            await loadCats();
            toast.show("Category deleted successfully!", { type: "success" });
        } catch (err) {
            console.error(err);
            const msg =
                err && err.message ? err.message : "Could not delete category";
            toast.show(msg, { type: "danger" });
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    }

    async function handleDelete(id) {
        if (
            !confirm(
                "Delete this category? Only allowed if no bulletins reference it.",
            )
        )
            return;
        try {
            const res = await authFetch(
                `${API_BASE_URL}/api/categories/${id}`,
                {
                    method: "DELETE",
                },
            );

            if (!res.ok) {
                const txt = await res.text();
                const msg = txt || "Failed to delete";
                toast.show(msg, { type: "danger" });
                throw new Error(msg);
            }

            await loadCats();
            toast.show("Category deleted successfully!", { type: "success" });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="mx-auto min-h-screen max-w-4xl p-6 fade-in">
            <h1 className="text-2xl font-bold">Manage Categories</h1>

            <form onSubmit={handleCreate} className="my-4">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Add Category</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="flex flex-col sm:col-span-1">
                            <span className="text-sm text-slate-700">Name</span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Category name"
                                aria-label="Category name"
                                className="mt-1 rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                            />
                        </label>

                        <label className="flex flex-col sm:col-span-2">
                            <span className="text-sm text-slate-700">
                                Description
                            </span>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description"
                                aria-label="Category description"
                                className="mt-1 rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                            />
                        </label>

                        <div className="sm:col-span-3 flex items-end">
                            <button
                                type="submit"
                                className="ml-auto rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-600 transition-colors cursor-pointer shadow-sm"
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {loading && <BulletinLoading />}

            {!loading && (
                <ul className="space-y-2">
                    {cats.map((c) => (
                        <li
                            key={c._id}
                            className="rounded border border-gray-200 bg-white p-3 flex items-center justify-between hover:shadow-sm ease-in-out duration-300 transition-shadow"
                        >
                            <div>
                                <div className="font-semibold">{c.name}</div>
                                <div className="text-xs text-slate-500">
                                    {c.slug}
                                </div>
                                <div className="text-sm">{c.description}</div>
                            </div>
                            <div>
                                <button
                                    onClick={() => requestDelete(c._id)}
                                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Confirmation modal */}
            {confirmDeleteId && (
                <div className="fade-in fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={cancelDelete}
                    ></div>
                    <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Are you sure you want to delete this category? This
                            cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="rounded border px-3 py-2 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => performDelete(confirmDeleteId)}
                                disabled={
                                    String(deletingId) ===
                                    String(confirmDeleteId)
                                }
                                className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                            >
                                {String(deletingId) === String(confirmDeleteId)
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
