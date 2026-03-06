import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoTrashOutline, IoWarningOutline } from "react-icons/io5";

export default function DeleteBulletin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bulletin, setBulletin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBulletin = async () => {
            try {
                const response = await fetch(`http://localhost:8080/bulletins/${id}`);
                if (!response.ok) {
                    throw new Error("Bulletin not found");
                }
                const data = await response.json();
                setBulletin(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBulletin();
    }, [id]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:8080/bulletins/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete bulletin");
            }

            navigate("/bulletins");
        } catch (err) {
            setError(err.message);
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-violet-600 text-xl font-semibold animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="text-red-500 text-xl font-semibold">Error: {error}</div>
                <button 
                    onClick={() => navigate("/bulletins")}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                >
                    Back to Board
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-violet-100 p-6 sm:p-12 flex items-center justify-center">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoWarningOutline className="text-3xl text-red-500" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Delete Bulletin?</h1>
                    <p className="text-slate-500 mb-6">
                        Are you sure you want to delete <span className="font-semibold text-slate-700">"{bulletin.title}"</span>? 
                        This action cannot be undone.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(`/bulletins/${id}`)}
                            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-200 disabled:opacity-70"
                        >
                            {isDeleting ? (
                                "Deleting..."
                            ) : (
                                <>
                                    <IoTrashOutline className="mr-2" />
                                    Delete Permanently
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}