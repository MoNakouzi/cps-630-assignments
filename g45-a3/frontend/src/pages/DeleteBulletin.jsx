import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import API_BASE_URL from "../config";
import BulletinNotFound from "../components/general/BulletinNotFound";
import DeleteBulletinError from "../components/deleteBulletin/DeleteBulletinError";
import BulletinLoading from "../components/general/BulletinLoading";
import DeleteBulletinPreview from "../components/deleteBulletin/DeleteBulletinPreview";
import DeleteBulletinActions from "../components/deleteBulletin/DeleteBulletinActions";
import { useToast } from "../context/ToastContext";

export default function DeleteBulletin() {
    // Get the bulletin ID from the URL parameters
    const { id } = useParams();
    const navigate = useNavigate();

    // State variables to manage bulletin data, loading state, not found state, deletion state, and error messages
    const [bulletin, setBulletin] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    // Get the authFetch function and current user from AuthContext to perform authenticated API requests
    const { authFetch, user } = useAuth();
    const toast = useToast();

    // reset scroll position to top since delete box is on top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        async function fetchBulletin() {
            try {
                setNotFound(false);
                setError("");

                const response = await fetch(
                    `${API_BASE_URL}/api/bulletins/${id}`,
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

                // Client-side guard, only the author or an admin should delete
                const authorId = data.author__id || data.author_id || (data.author && (data.author._id || data.author));
                const uid = String(user?.id || user?._id || user?._id);

                if (!user) {
                    toast.show("You must be signed in to delete this bulletin.", { type: "danger" });
                    navigate("/login", { state: { from: `/delete/${id}` } });
                    return;
                }

                if (user.role !== "admin" && String(authorId) !== uid) {
                    toast.show("You are not authorized to delete this bulletin.", { type: "danger" });
                    navigate(`/bulletins/${id}`);
                    return;
                }

                setBulletin(data);
            } catch (err) {
                console.error("Error fetching bulletin:", err);
                setError("Could not load bulletin.");
            }
        }

        fetchBulletin();
    }, [id, user]);

    async function handleSoftDelete() {
        try {
            setIsDeleting(true);

            const response = await authFetch(
                `${API_BASE_URL}/api/bulletins/${id}/soft-delete`,
                { method: "POST" },
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to soft-delete bulletin");
            }

            toast.show("Bulletin soft-deleted.", { type: "success" });
            navigate("/bulletins");
        } catch (err) {
            console.error("Error soft-deleting bulletin:", err);
            toast.show(`Error deleting bulletin: ${err.message}`, {
                type: "danger",
            });
            setIsDeleting(false);
        }
    }

    async function handlePermanentDelete() {
        try {
            setIsDeleting(true);

            const response = await authFetch(
                `${API_BASE_URL}/api/bulletins/${id}`,
                { method: "DELETE" },
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(
                    text || "Failed to permanently delete bulletin",
                );
            }

            toast.show("Bulletin permanently deleted.", { type: "success" });
            navigate("/bulletins");
        } catch (err) {
            console.error("Error permanently deleting bulletin:", err);
            toast.show(`Error deleting bulletin: ${err.message}`, {
                type: "danger",
            });
            setIsDeleting(false);
        }
    }

    async function handleRestore() {
        try {
            setIsDeleting(true);

            const response = await authFetch(
                `${API_BASE_URL}/api/bulletins/${id}/restore`,
                { method: "POST" },
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to restore bulletin");
            }

            toast.show("Bulletin restored.", { type: "success" });
            navigate(`/bulletins/${id}`);
        } catch (err) {
            console.error("Error restoring bulletin:", err);
            toast.show(`Error restoring bulletin: ${err.message}`, {
                type: "danger",
            });
            setIsDeleting(false);
        }
    }

    if (notFound) {
        return <BulletinNotFound id={id} />;
    }

    return (
        <main className="mx-auto min-h-screen max-w-xl px-4 py-10 fade-in">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-red-600">
                    Delete Bulletin
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Are you sure you want to delete this bulletin? This cannot
                    be undone.
                </p>

                <DeleteBulletinError error={error} />

                {bulletin === null && !error && <BulletinLoading />}

                {bulletin && <DeleteBulletinPreview bulletin={bulletin} />}

                <DeleteBulletinActions
                    isDeleting={isDeleting}
                    bulletin={bulletin}
                    handleSoftDelete={handleSoftDelete}
                    handlePermanentDelete={handlePermanentDelete}
                    handleRestore={handleRestore}
                />
            </div>
        </main>
    );
}
