import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
    const { authFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadUsers() {
        setLoading(true);
        setError("");
        try {
            const res = await authFetch(`${API_BASE_URL}/api/users`);
            if (!res.ok)
                throw new Error(`Failed to load users (status ${res.status})`);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not load users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <main className="mx-auto min-h-screen max-w-4xl p-6 fade-in">
            <h1 className="text-2xl font-bold">View Users</h1>
            {error && <p className="text-red-600">{error}</p>}
            {loading && <p className="mt-4">Loading...</p>}

            {!loading && !error && (
                <div className="mt-6 space-y-3">
                    {users.map((u) => (
                        <div
                            key={String(u._id || u.id)}
                            className="rounded border border-gray-400 bg-white p-4 flex items-center justify-between"
                        >
                            <div>
                                <div className="font-semibold">{u.name}</div>
                                <div className="text-xs text-slate-500">
                                    {u.email}
                                </div>
                                <div className="text-sm">Role: {u.role}</div>
                            </div>
                            <div className="text-sm text-slate-500">
                                Created:{" "}
                                {new Date(u.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
