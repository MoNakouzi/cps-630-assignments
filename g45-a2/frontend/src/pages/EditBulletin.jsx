import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack, IoSaveOutline } from "react-icons/io5";

export default function EditBulletin() {
    return <></>;
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBulletin = async () => {
            try {
                const response = await fetch(`http://localhost:8080/bulletins/${id}`);
                if (!response.ok) {
                    throw new Error("Bulletin not found");
                }
                const data = await response.json();
                setFormData({
                    title: data.title || "",
                    content: data.content || data.description || ""
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBulletin();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/bulletins/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update bulletin");
            }

            navigate(`/bulletins/${id}`);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-violet-600 text-xl font-semibold animate-pulse">Loading details...</div>
            </div>
        );
    }

    if (error && !formData.title) {
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
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate(`/bulletins/${id}`)}
                    className="inline-flex items-center text-violet-600 hover:text-violet-800 mb-6 transition-colors font-medium"
                >
                    <IoArrowBack className="mr-2" />
                    Back to Detail
                </button>

                <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
                    <div className="p-8 sm:p-10 border-b border-slate-100">
                        <h1 className="text-3xl font-bold text-slate-900">Edit Bulletin</h1>
                        <p className="text-slate-500 mt-2">Update your announcement details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                                placeholder="Enter bulletin title..."
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none"
                                placeholder="Write your announcement details here..."
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/bulletins/${id}`)}
                                className="px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-lg hover:shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span>Saving...</span>
                                ) : (
                                    <>
                                        <IoSaveOutline className="mr-2 text-lg" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}