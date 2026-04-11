import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import API_BASE_URL from "../config";
import formatDateToToronto from "../utils/formatDate";
import BulletinLoading from "../components/general/BulletinLoading";
import EditBulletinErrorState from "../components/editBulletin/EditBulletinErrorState";
import BulletinForm from "../components/bulletinForm/BulletinForm";

function validateBulletinInput(formData, currentUser = null) {
    const errors = [];

    if (typeof formData.title !== "string" || !formData.title.trim()) {
        errors.push("Title is required.");
    }

    if (typeof formData.category !== "string" || !formData.category.trim()) {
        errors.push("Category is required.");
    }

    // If user is not logged in, they cannot edit a bulletin
    if (!currentUser) {
        errors.push("You must be logged in to edit a bulletin.");
    }

    if (typeof formData.message !== "string") {
        errors.push("Message must be text.");
    }

    return errors;
}

export default function EditBulletin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        message: "",
        author: "",
        date: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Get authFetch and current user from AuthContext to perform authenticated requests and access user info
    const { authFetch, user } = useAuth();
    const toast = useToast();

    useEffect(() => {
        async function fetchBulletinDetails() {
            setLoading(true);
            setError("");

            try {
                // Retrieve bulletin by ID to pre-fill the form
                const response = await fetch(
                    `${API_BASE_URL}/api/bulletins/${id}`,
                );

                if (!response.ok) {
                    throw new Error("Failed to load bulletin details.");
                }

                const bulletin = await response.json();

                // Client-side guard, only the author or an admin should edit
                const authorId = bulletin.author__id || bulletin.author_id || (bulletin.author && (bulletin.author._id || bulletin.author));
                const uid = String(user?.id || user?._id || user?._id);

                if (!user) {
                    toast.show("You must be signed in to edit this bulletin.", { type: "danger" });
                    navigate("/login", { state: { from: `/edit/${id}` } });
                    return;
                }

                if (user.role !== "admin" && String(authorId) !== uid) {
                    toast.show("You are not authorized to edit this bulletin.", { type: "danger" });
                    navigate(`/bulletins/${id}`);
                    return;
                }

                // Pre-fill form with existing bulletin data
                setFormData({
                    title: bulletin.title || "",
                    category: bulletin.category_name || "",
                    message: bulletin.message || "",
                    author: bulletin.author_name || "",
                    date: formatDateToToronto(bulletin.date) || "",
                    visibility: bulletin.visibility || "public",
                });
            } catch (fetchError) {
                setError(fetchError.message || "Could not fetch bulletin.");
            } finally {
                setLoading(false);
            }
        }

        fetchBulletinDetails();
    }, [id, user]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedData = {
            title: formData.title.trim(),
            category: formData.category.trim(),
            message:
                typeof formData.message === "string"
                    ? formData.message.trim()
                    : "",
            visibility: formData.visibility || "public",
            // We don't submit author field from client; server enforces author unless admin
        };

        const validationErrors = validateBulletinInput(trimmedData, user);

        if (validationErrors.length > 0) {
            toast.show(validationErrors.join(" \n"), { type: "danger" });
            return;
        }

        setSaving(true);
        setError("");

        try {
            // Send PATCH request to update the bulletin with the new data using authFetch for authentication
            const response = await authFetch(
                `${API_BASE_URL}/api/bulletins/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(trimmedData),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to update bulletin.");
            }

            toast.show("Bulletin updated successfully!", { type: "success" });
            navigate("/bulletins");
        } catch (updateError) {
            setError(updateError.message || "Could not update bulletin.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <BulletinLoading />;
    }

    if (error && !saving && !formData.title) {
        return (
            <EditBulletinErrorState
                error={error}
                onBackToBoard={() => navigate("/bulletins")}
            />
        );
    }

    return (
        <div className="min-h-screen p-6 sm:p-12 fade-in">
            <div className="mx-auto max-w-3xl">
                <BulletinForm
                    formTitle="Edit Bulletin"
                    formDescription="Update the bulletin details and save your changes."
                    formData={formData}
                    error={error}
                    submitting={saving}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(`/bulletins/${id}`)}
                    submitLabel="Save Changes"
                    submittingLabel="Saving..."
                    showDate={true}
                    cancelLabel="Back to Details"
                    currentUser={user}
                />
            </div>
        </div>
    );
}
