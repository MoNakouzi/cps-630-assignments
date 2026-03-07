import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config";
import BulletinLoading from "../components/general/BulletinLoading";
import EditBulletinErrorState from "../components/editBulletin/EditBulletinErrorState";
import EditBulletinHeader from "../components/editBulletin/EditBulletinHeader";
import EditBulletinForm from "../components/editBulletin/EditBulletinForm";

function validateBulletinInput(formData) {
	const errors = [];

	if (typeof formData.title !== "string" || !formData.title.trim()) {
		errors.push("Title is required.");
	}

	if (typeof formData.category !== "string" || !formData.category.trim()) {
		errors.push("Category is required.");
	}

	if (typeof formData.author !== "string" || !formData.author.trim()) {
		errors.push("Author is required.");
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

	useEffect(() => {
		async function fetchBulletinDetails() {
			setLoading(true);
			setError("");

			try {
				// Retrieve bulletin by ID to pre-fill the form
				const response = await fetch(`${API_BASE_URL}/api/bulletins/${id}`);

				if (!response.ok) {
					throw new Error("Failed to load bulletin details.");
				}

				const bulletin = await response.json();
				setFormData({
					title: bulletin.title || "",
					category: bulletin.category || "",
					message: bulletin.message || "",
					author: bulletin.author || "",
					date: bulletin.date || "",
				});
			} catch (fetchError) {
				setError(fetchError.message || "Could not fetch bulletin.");
			} finally {
				setLoading(false);
			}
		}

		fetchBulletinDetails();
	}, [id]);

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
			message: typeof formData.message === "string" ? formData.message.trim() : "",
			author: formData.author.trim(),
		};

		const validationErrors = validateBulletinInput(trimmedData);

		if (validationErrors.length > 0) {
			alert(validationErrors.join("\n"));
			return;
		}

		setSaving(true);
		setError("");

		try {
			const response = await fetch(`${API_BASE_URL}/api/bulletins/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(trimmedData),
			});

			if (!response.ok) {
				throw new Error("Failed to update bulletin.");
			}

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
		<div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-violet-100 p-6 sm:p-12">
			<div className="max-w-3xl mx-auto">
				<EditBulletinHeader onBackToDetails={() => navigate(`/bulletins/${id}`)} />
				<EditBulletinForm
					formData={formData}
					error={error}
					saving={saving}
					onInputChange={handleInputChange}
					onSubmit={handleSubmit}
					onCancel={() => navigate(`/bulletins/${id}`)}
				/>
			</div>
		</div>
	);
}
