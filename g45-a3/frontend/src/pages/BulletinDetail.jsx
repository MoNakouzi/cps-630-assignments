import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import formatDateToToronto from "../utils/formatDate";
import BulletinNotFound from "../components/general/BulletinNotFound";
import BulletinLoading from "../components/general/BulletinLoading";
import BulletinChatRoom from "../components/general/BulletinChatRoom";

export default function BulletinDetail() {
    const { id } = useParams();
    const { user, authFetch } = useAuth();

    const [bulletin, setBulletin] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [forbidden, setForbidden] = useState(false);

    function isOwner(bulletin) {
        if (!user) return false;
        if (user.role === "admin") return true;

        const uid = String(user.id || user._id);
        const authorId =
            bulletin.author__id ||
            bulletin.author_id ||
            (bulletin.author && (bulletin.author._id || bulletin.author));

        return String(authorId) === uid;
    }

    useEffect(() => {
        async function fetchBulletin() {
            try {
                setNotFound(false);

                // Use authFetch when available so the Authorization header is sent
                const fetcher = authFetch || fetch;
                const response = await fetcher(
                    `${API_BASE_URL}/api/bulletins/${id}`,
                );

                if (response.status === 404) {
                    setNotFound(true);
                    setBulletin(null);
                    return;
                }

                if (response.status === 403) {
                    // Not authorized to view this bulletin
                    setForbidden(true);
                    setBulletin(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch bulletin");
                }

                const data = await response.json();
                setBulletin(data);
            } catch (err) {
                console.error("Error fetching bulletin:", err);
            }
        }

        fetchBulletin();
    }, [id, authFetch]);

    if (notFound) {
        return <BulletinNotFound id={id} />;
    }

    if (!bulletin) {
        if (forbidden) {
            return (
                <section className="mx-auto max-w-3xl px-4 py-10">
                    <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
                        <div className="border-b border-violet-100 bg-violet-50 px-6 py-4">
                            <h1 className="text-lg font-semibold text-slate-900">
                                Not authorized
                            </h1>
                        </div>
                        <div className="px-6 py-6">
                            <p className="text-sm leading-6 text-slate-700">
                                You do not have permission to view this private
                                bulletin. If you are the author, sign in with
                                the correct account, otherwise contact an
                                administrator.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/bulletins"
                                    className="inline-flex rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                                >
                                    Back to Bulletins
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        return <BulletinLoading />;
    }

    return (
        <section className="max-w-4xl mx-auto px-4 py-8">
            <div className="rounded-2xl bg-white shadow-md border border-violet-200 p-6">
                <h1 className="text-3xl font-bold text-violet-900 mb-4">
                    Bulletin Details
                </h1>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {bulletin.title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="mt-1 inline-block rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800">
                                {bulletin.category_name}
                            </p>

                            {bulletin.visibility === "private" && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m0-6v2m0 0v2m-6 4h12a2 2 0 0 0 2-2V9a6 6 0 0 0-12 0v10z"
                                        ></path>
                                    </svg>
                                    Private
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Bulletin ID
                            </p>
                            <p className="text-gray-900 break-all">
                                {bulletin._id}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Created By
                            </p>
                            <p className="text-gray-900">
                                {bulletin.author_name || "Unknown"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Date Created
                            </p>
                            <p className="text-gray-900">
                                {formatDateToToronto(bulletin.date) ||
                                    "No date available"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Category
                            </p>
                            <p className="text-gray-900">
                                {bulletin.category_name || "Uncategorized"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Message
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-gray-800">
                            {bulletin.message && bulletin.message.trim()
                                ? bulletin.message
                                : "No message content was provided."}
                        </p>
                    </div>

                    {isOwner(bulletin) && (
                        <div className="flex gap-3 pt-2">
                            <Link
                                to={`/edit/${bulletin._id}`}
                                className="rounded-lg bg-violet-700 px-4 py-2 text-white hover:bg-violet-800"
                            >
                                Edit Bulletin
                            </Link>

                            <Link
                                to={`/delete/${bulletin._id}`}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Delete Bulletin
                            </Link>
                        </div>
                    )}

                    <div className="pt-2">
                        <Link
                            to="/bulletins"
                            className="text-violet-700 hover:text-violet-900 font-medium"
                        >
                            ← Back to Bulletins
                        </Link>
                    </div>
                </div>
            </div>

            <BulletinChatRoom bulletinId={id} />
        </section>
    );
}
