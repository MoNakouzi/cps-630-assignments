import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import BulletinForm from "../components/bulletinForm/BulletinForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function validateBulletinInput(formData, currentUser = null) {
    const errors = [];

    if (typeof formData.title !== "string" || !formData.title.trim()) {
        errors.push("Title is required.");
    }

    if (typeof formData.category !== "string" || !formData.category.trim()) {
        errors.push("Category is required.");
    }

    // If user is not authenticated, they are not allowed to create a bulletin (guests cannot create bulletins)
    if (!currentUser) {
        errors.push("You must be logged in to create a bulletin.");
    }

    if (typeof formData.message !== "string") {
        errors.push("Message must be text.");
    }

    return errors;
}

export default function CreateBulletin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        message: "",
        author: "",
        date: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { authFetch, user } = useAuth();
    const toast = useToast();

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            // server will set authenticated user as author
        };

        const validationErrors = validateBulletinInput(trimmedData, user);

        if (validationErrors.length > 0) {
            setError(validationErrors.join(" "));
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // Use authFetch to send POST request with auth headers
            const response = await authFetch(`${API_BASE_URL}/api/bulletins`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trimmedData),
            });

            if (!response.ok) {
                throw new Error("Failed to create bulletin.");
            }

            const createdBulletin = await response.json();
            toast.show("Bulletin created successfully!", { type: "success" });
            navigate(`/bulletins/${createdBulletin._id}`);
        } catch (createError) {
            setError(createError.message || "Could not create bulletin.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen p-6 sm:p-12 fade-in">
            <div className="mx-auto max-w-3xl">
                <BulletinForm
                    formTitle="Create Bulletin"
                    formDescription="Post a new announcement, update, or notice for others to view on the bulletin board."
                    formData={formData}
                    error={error}
                    submitting={submitting}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/bulletins")}
                    submitLabel="Create Bulletin"
                    submittingLabel="Creating..."
                    showDate={false}
                    cancelLabel="Back to Bulletins"
                    currentUser={user}
                />
            </div>
        </div>
    );
}
