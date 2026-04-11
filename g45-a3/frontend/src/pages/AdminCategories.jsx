import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";

export default function AdminCategories() {
    // Get authFetch from AuthContext to perform authenticated API requests
    const { authFetch } = useAuth();

    // State for categories, loading status, error messages, and form inputs
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Function to load categories from the API
    async function loadCats() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            setCats(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not load categories");
        } finally {
            setLoading(false);
        }
    }

    // Load categories on component mount
    useEffect(() => {
        loadCats();
    }, []);

    // Handler for creating a new category
    async function handleCreate(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await authFetch(`${API_BASE_URL}/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to create category");
            }
            await loadCats();
            setName("");
            setDescription("");
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not create category");
        }
    }

    // Handler for deleting a category
    async function handleDelete(id) {
        if (!confirm("Delete this category? Only allowed if no bulletins reference it.")) return;
        try {
            const res = await authFetch(`${API_BASE_URL}/api/categories/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to delete");
            }
            await loadCats();
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not delete category");
        }
    }

    return (
        <main className="mx-auto min-h-screen max-w-4xl p-6 fade-in">
            <h1 className="text-2xl font-bold">Manage Categories</h1>
            {error && <p className="text-red-600">{error}</p>}

            <form onSubmit={handleCreate} className="my-4 flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded border px-2" />
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded border px-2" />
                <button className="rounded bg-violet-500 px-3 py-1 text-white">Add</button>
            </form>

            {loading && <p>Loading...</p>}
            {!loading && (
                <ul className="space-y-2">
                    {cats.map((c) => (
                        <li key={c._id} className="rounded border bg-white p-3 flex items-center justify-between">
                            <div>
                                <div className="font-semibold">{c.name}</div>
                                <div className="text-xs text-slate-500">{c.slug}</div>
                                <div className="text-sm">{c.description}</div>
                            </div>
                            <div>
                                <button onClick={() => handleDelete(c._id)} className="rounded bg-red-500 px-3 py-1 text-white">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
