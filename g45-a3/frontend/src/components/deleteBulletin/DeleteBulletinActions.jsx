import { Link } from "react-router-dom";

export default function DeleteBulletinActions({
    isDeleting,
    bulletin,
    handleDelete,
}) {
    return (
        <div className="mt-6 flex items-center gap-3">
            <Link
                to="/bulletins"
                className="rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-300"
            >
                Cancel
            </Link>

            <button
                id="confirmDelete"
                onClick={handleDelete}
                disabled={isDeleting || !bulletin}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
        </div>
    );
}