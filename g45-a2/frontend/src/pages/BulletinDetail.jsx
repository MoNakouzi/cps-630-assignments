import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack, IoCalendarOutline, IoCreateOutline, IoTrashOutline } from "react-icons/io5";

export default function BulletinDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bulletin, setBulletin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBulletin = async () => {
            try {
                // TODO: Ensure this URL matches your backend API route
                const response = await fetch(`http://localhost:8080/bulletins/${id}`);
                if (!response.ok) {
                    throw new Error(`Bulletin not found: ${response.status}`);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-violet-600 text-xl font-semibold animate-pulse">Loading details...</div>
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
        <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-violet-100 p-6 sm:p-12">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate("/bulletins")}
                    className="inline-flex items-center text-violet-600 hover:text-violet-800 mb-6 transition-colors font-medium"
                >
                    <IoArrowBack className="mr-2" />
                    Back to Board
                </button>

                <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                            {bulletin.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-1">
                                <IoCalendarOutline className="text-violet-500" />
                                <span>
                                    {bulletin.date 
                                        ? new Date(bulletin.date).toLocaleDateString() 
                                        : (bulletin.created_at ? new Date(bulletin.created_at).toLocaleDateString() : new Date().toLocaleDateString())}
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-violet max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {bulletin.message || bulletin.content || bulletin.description || "No content available."}
                        </div>
                    </div>

                    <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            onClick={() => navigate(`/edit/${id}`)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-violet-600 transition-colors shadow-sm font-medium"
                        >
                            <IoCreateOutline className="mr-2" />
                            Edit
                        </button>
                        <button
                            onClick={() => navigate(`/delete/${id}`)}
                            className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 hover:bg-red-100 transition-colors shadow-sm font-medium"
                        >
                            <IoTrashOutline className="mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
