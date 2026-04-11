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
                const res = await authFetch(
                    `${API_BASE_URL}/api/bulletins/stats`,
                );

                if (!res.ok) {
                    // try to extract server-provided message for easier debugging
                    let msg = `Failed to load stats (status ${res.status})`;
                    try {
                        // Check if response has JSON content-type and extract error message
                        const ct = res.headers.get("content-type") || "";

                        if (ct.includes("application/json")) {
                            const body = await res.json();
                            msg +=
                                ": " +
                                (body.error ||
                                    body.message ||
                                    JSON.stringify(body));
                        } else {
                            const text = await res.text();
                            if (text) msg += ": " + text;
                        }
                    } catch (e) {
                        console.warn("Could not parse error response body:", e);
                    }
                    throw new Error(msg);
                }

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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => (window.location.href = "/admin/categories")}
                        className="rounded bg-violet-500 px-3 py-2 text-sm text-white hover:bg-violet-700 transition-colors cursor-pointer shadow-sm"
                    >
                        Manage Categories
                    </button>
                    <button
                        onClick={() => (window.location.href = "/admin/users")}
                        className="rounded border px-3 py-2 text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        View Users
                    </button>
                </div>
            </div>

            {error && <p className="text-red-600 mt-3">{error}</p>}

            {!stats && !error && <p className="mt-4">Loading...</p>}

            {stats && (
                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="rounded-lg border bg-white p-4">
                            <h2 className="font-semibold">Overview</h2>
                            <p>Total bulletins: {stats.total}</p>
                            <p>Active bulletins: {stats.totalActive}</p>
                        </div>

                        <div className="rounded-lg border bg-white p-4">
                            <h2 className="font-semibold">
                                Bulletins per Category
                            </h2>
                            <ul className="mt-2 text-sm">
                                {stats.perCategory.map((c) => (
                                    <li key={String(c.categoryId)}>
                                        {c.categoryName}: {c.count}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4">
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
