import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoSaveOutline } from "react-icons/io5";
import API_BASE_URL from "../config";

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

	const formattedDate = useMemo(() => {
		if (!formData.date) {
			return "Unavailable";
		}

		const dateValue = new Date(formData.date);

		if (Number.isNaN(dateValue.getTime())) {
			return formData.date;
		}

		return dateValue.toLocaleString();
	}, [formData.date]);

	useEffect(() => {
		async function fetchBulletinDetails() {
			setLoading(true);
			setError("");

			try {
				// Backend defines GET /bulletins/:id for single bulletin fetch.
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
			const response = await fetch(`${API_BASE_URL}/api/bulletins/id/${id}`, {
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
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<p className="text-violet-700 text-lg font-semibold animate-pulse">Loading bulletin...</p>
			</div>
		);
	}

	if (error && !saving && !formData.title) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-6 text-center">
				<p className="text-red-600 font-semibold">{error}</p>
				<button
					type="button"
					onClick={() => navigate("/bulletins")}
					className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
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
					type="button"
					onClick={() => navigate(`/bulletins/${id}`)}
					className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-900 mb-6 font-medium transition-colors"
				>
					<IoArrowBack />
					Back to Details
				</button>

				<div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
					<div className="p-8 sm:p-10 border-b border-slate-100">
						<h1 className="text-3xl font-bold text-slate-900">Edit Bulletin</h1>
						<p className="mt-2 text-slate-600">Update the bulletin details and save your changes.</p>
					</div>

					<form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
						{error ? (
							<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
								{error}
							</div>
						) : null}

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<div className="sm:col-span-2">
								<label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-2">
									Title <span className="text-red-600">*</span>
								</label>
								<input
									id="title"
									name="title"
									type="text"
									value={formData.title}
									onChange={handleInputChange}
									className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
									placeholder="Enter bulletin title"
								/>
							</div>

							<div>
								<label htmlFor="category" className="block text-sm font-semibold text-slate-800 mb-2">
									Category <span className="text-red-600">*</span>
								</label>
								<input
									id="category"
									name="category"
									type="text"
									value={formData.category}
									onChange={handleInputChange}
									className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
									placeholder="e.g., General"
								/>
							</div>

							<div>
								<label htmlFor="author" className="block text-sm font-semibold text-slate-800 mb-2">
									Author <span className="text-red-600">*</span>
								</label>
								<input
									id="author"
									name="author"
									type="text"
									value={formData.author}
									onChange={handleInputChange}
									className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
									placeholder="Author name"
								/>
							</div>

							<div className="sm:col-span-2">
								<label htmlFor="message" className="block text-sm font-semibold text-slate-800 mb-2">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									rows="7"
									value={formData.message}
									onChange={handleInputChange}
									className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition resize-y"
									placeholder="Add bulletin details"
								/>
							</div>

							<div className="sm:col-span-2">
								<label className="block text-sm font-semibold text-slate-800 mb-2">Last Updated Date</label>
								<div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
									{formattedDate}
								</div>
								<p className="mt-1 text-xs text-slate-500">
									Date is maintained by the backend and will refresh after saving.
								</p>
							</div>
						</div>

						<div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
							<button
								type="button"
								onClick={() => navigate(`/bulletins/${id}`)}
								className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
								disabled={saving}
							>
								Cancel
							</button>

							<button
								type="submit"
								disabled={saving}
								className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors shadow-lg hover:shadow-violet-200 disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{saving ? (
									"Saving..."
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
