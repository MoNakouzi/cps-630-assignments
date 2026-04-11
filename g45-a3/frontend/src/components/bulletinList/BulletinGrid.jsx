import { Link } from "react-router-dom";
import formatDateToToronto from "../../utils/formatDate";
import { useAuth } from "../../context/AuthContext";

export default function BulletinGrid({ bulletins }) {
    const { user } = useAuth();

    // Helper function to determine if the current user is the owner of the bulletin or an admin
    function isOwner(b) {
        // If user is not logged in, always return false
        if (!user) {
            return false;
        }

        // If user is an admin, always return true
        if (user.role === "admin") {
            return true;
        }

        // Compare the user's ID with the bulletin's author ID
        const uid = String(user.id || user._id || user.__id);

        // possible author id fields from backend flattening
        const authorId =
            b.author__id ||
            b.author_id ||
            (b.author && (b.author._id || b.author));

        // Return true if the user is the author of the bulletin, false otherwise
        return String(authorId) === uid;
    }
    return (
        <section id="bulletinGrid" className="masonry">
            {bulletins.map((b) => (
                <article
                    key={b._id}
                    className="masonry-item rounded-2xl border border-violet-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-semibold leading-6 text-slate-900">
                            {b.title}
                        </h2>

                        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                            {b.category_name}
                        </span>
                    </div>

                    {/* Clamped message */}
                    <p className="mt-3 text-sm text-slate-600 leading-6 line-clamp-3">
                        {b.message}
                    </p>

                    {/* Read more */}
                    <Link
                        to={`/bulletins/${b._id}`}
                        className="inline-block mt-2 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                        Read More
                    </Link>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <div>
                            <span className="">Created By:</span>{" "}
                            <span className="font-medium text-slate-600">
                                {b.author_name}
                            </span>
                        </div>

                        <p>{formatDateToToronto(b.date) || "No date"}</p>
                    </div>

                    {isOwner(b) && (
                        <div className="mt-4 flex items-center justify-start gap-3">
                            <Link
                                to={`/edit/${b._id}`}
                                className="text-xs rounded-lg bg-violet-500 px-3 py-2 text-white hover:bg-violet-700 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md"
                            >
                                Edit
                            </Link>
                            <Link
                                to={`/delete/${b._id}`}
                                className="text-xs rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md"
                            >
                                Delete
                            </Link>
                        </div>
                    )}
                </article>
            ))}
        </section>
    );
}
