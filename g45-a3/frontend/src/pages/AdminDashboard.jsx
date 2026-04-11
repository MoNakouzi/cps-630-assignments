import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
    const { authFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await authFetch(`${API_BASE_URL}/api/bulletins/stats`);
                if (!res.ok) throw new Error("Failed to load stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Could not load stats");
            }
        }
        loadStats();
    }, []);

    return (
        <main className="mx-auto min-h-screen max-w-4xl p-6 fade-in">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {error && <p className="text-red-600">{error}</p>}

            {!stats && !error && <p>Loading...</p>}

            {stats && (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-lg border bg-white p-4">
                        <h2 className="font-semibold">Overview</h2>
                        <p>Total bulletins: {stats.total}</p>
                        <p>Active bulletins: {stats.totalActive}</p>
                    </div>

                    <div className="rounded-lg border bg-white p-4">
                        <h2 className="font-semibold">Bulletins per Category</h2>
                        <ul className="mt-2 text-sm">
                            {stats.perCategory.map((c) => (
                                <li key={String(c.categoryId)}>
                                    {c.categoryName}: {c.count}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg border bg-white p-4 sm:col-span-2">
                        <h2 className="font-semibold">Bulletins per User</h2>
                        <ul className="mt-2 text-sm">
                            {stats.perUser.map((u) => (
                                <li key={String(u.userId)}>
                                    {u.userName}: {u.count}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </main>
    );
}
