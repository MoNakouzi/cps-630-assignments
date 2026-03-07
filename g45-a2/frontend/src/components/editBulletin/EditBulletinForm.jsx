export default function EditBulletinForm({
    formData,
    error,
    saving,
    onInputChange,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-violet-200 overflow-hidden">
            <div className="py-6 px-8 sm:px-10 border-b-2 border-violet-200">
                <h1 className="text-3xl font-bold text-slate-900">
                    Edit Bulletin
                </h1>
                <p className="mt-2 text-slate-600">
                    Update the bulletin details and save your changes.
                </p>
            </div>

            <form onSubmit={onSubmit} className="py-6 px-8 sm:px-10 space-y-6">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="title"
                            className="block text-sm font-semibold text-slate-800 mb-2"
                        >
                            Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                            placeholder="Enter bulletin title"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-semibold text-slate-800 mb-2"
                        >
                            Category <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="category"
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                            placeholder="e.g., General"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="author"
                            className="block text-sm font-semibold text-slate-800 mb-2"
                        >
                            Author <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="author"
                            name="author"
                            type="text"
                            value={formData.author}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                            placeholder="Author name"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="message"
                            className="block text-sm font-semibold text-slate-800 mb-2"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="7"
                            value={formData.message}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition resize-y"
                            placeholder="Add bulletin details"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Last Updated Date
                        </label>
                        <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                            {formData.date}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Date is maintained by the backend and will refresh
                            after saving.
                        </p>
                    </div>
                </div>

                <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
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
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
