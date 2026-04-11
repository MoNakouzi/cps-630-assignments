import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DeleteBulletinActions({
    isDeleting,
    bulletin,
    handleSoftDelete,
    handlePermanentDelete,
    handleRestore,
}) {
    const { user } = useAuth();

    return (
        <div className="mt-6 flex items-center gap-3">
            <Link
                to="/bulletins"
                className="rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-300"
            >
                Cancel
            </Link>

            {/* Admins get extra controls */}
            {user && user.role === "admin" ? (
                <>
                    {bulletin && bulletin.isDeleted ? (
                        <>
                            <button
                                onClick={handleRestore}
                                disabled={isDeleting}
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Working..." : "Restore"}
                            </button>

                            <button
                                onClick={handlePermanentDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Permanently Delete"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleSoftDelete}
                            disabled={isDeleting || !bulletin}
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Working..." : "Soft Delete"}
                        </button>
                    )}
                </>
            ) : (
                // Regular users: only soft-delete
                <button
                    onClick={handleSoftDelete}
                    disabled={isDeleting || !bulletin}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
            )}
        </div>
    );
}