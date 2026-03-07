import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import BulletinNotFound from "../components/bulletinDetail/BulletinNotFound";
import BulletinLoading from "../components/general/BulletinLoading";

export default function BulletinDetail() {
    const { id } = useParams();

    const [bulletin, setBulletin] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchBulletin() {
            try {
                setNotFound(false);

                const response = await fetch(
                    `${API_BASE_URL}/api/bulletins/${id}`,
                );
                console.log(
                    `Fetching bulletin with ID: ${id}, Response status: ${response.status}`,
                );

                if (response.status === 404) {
                    setNotFound(true);
                    setBulletin(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch bulletin");
                }

                const data = await response.json();
                console.log("Fetched bulletin:", data);
                setBulletin(data);
            } catch (err) {
                console.error("Error fetching bulletin:", err);
            }
        }

        fetchBulletin();
    }, [id]);

    if (notFound) {
        return <BulletinNotFound id={id} />;
    }

    // If found and bulletin is null, it means we're still loading
    if (!bulletin) {
        return (
            <BulletinLoading />
        );
    }

    return (
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm">
                <div className="border-b border-violet-100 bg-linear-to-r from-violet-50 to-white px-6 py-6 sm:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                                Bulletin Details
                            </p>

                            <h1 className="mt-2 wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {bulletin.title}
                            </h1>
                        </div>

                        <div className="shrink-0">
                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                {bulletin.category}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                    <dl className="divide-y divide-slate-100">
                        <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold text-slate-500">
                                Created By
                            </dt>
                            <dd className="text-sm text-slate-900">
                                {bulletin.author || "Unknown"}
                            </dd>
                        </div>

                        <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold text-slate-500">
                                Category
                            </dt>
                            <dd className="text-sm text-slate-900">
                                {bulletin.category || "Uncategorized"}
                            </dd>
                        </div>

                        <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold text-slate-500">
                                Date
                            </dt>
                            <dd className="text-sm text-slate-900">
                                {bulletin.date || "No date available"}
                            </dd>
                        </div>

                        <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold text-slate-500">
                                Bulletin ID
                            </dt>
                            <dd className="break-all text-sm text-slate-700">
                                {bulletin._id}
                            </dd>
                        </div>

                        <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold text-slate-500">
                                Message
                            </dt>
                            <dd className="text-sm leading-7 whitespace-pre-line text-slate-800">
                                {bulletin.message && bulletin.message.trim()
                                    ? bulletin.message
                                    : "No message content was provided."}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap">
                        <Link
                            to={`/edit/${bulletin._id}`}
                            className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            Edit Bulletin
                        </Link>

                        <Link
                            to={`/delete/${bulletin._id}`}
                            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm hover:shadow-md"
                        >
                            Delete Bulletin
                        </Link>

                        <Link
                            to="/bulletins"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                            Back to Bulletins
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
