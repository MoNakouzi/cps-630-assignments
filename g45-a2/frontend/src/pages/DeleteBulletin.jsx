import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import BulletinNotFound from "../components/general/BulletinNotFound";
import DeleteBulletinError from "../components/deleteBulletin/DeleteBulletinError";
import BulletinLoading from "../components/general/BulletinLoading";
import DeleteBulletinPreview from "../components/deleteBulletin/DeleteBulletinPreview";
import DeleteBulletinActions from "../components/deleteBulletin/DeleteBulletinActions";

export default function DeleteBulletin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bulletin, setBulletin] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

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
                setBulletin(data);
            } catch (err) {
                console.error("Error fetching bulletin:", err);
                setError("Could not load bulletin.");
            }
        }

        fetchBulletin();
    }, [id]);

    async function handleDelete() {
        try {
            setIsDeleting(true);

            const response = await fetch(
                `${API_BASE_URL}/api/bulletins/${id}`,
                {
                    method: "DELETE",
                },
            );

            console.log(
                `Deleting bulletin with ID: ${id}, Response status: ${response.status}`,
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to delete bulletin");
            }

            alert("Bulletin deleted successfully.");
            navigate("/bulletins");
        } catch (err) {
            console.error("Error deleting bulletin:", err);
            alert(`Error deleting bulletin: ${err.message}`);

            // re-enable button if delete fails
            setIsDeleting(false);
        }
    }

    if (notFound) {
        return <BulletinNotFound id={id} />;
    }

    return (
        <main className="mx-auto min-h-screen max-w-xl px-4 py-10">
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
                    handleDelete={handleDelete}
                />
            </div>
        </main>
    );
}
