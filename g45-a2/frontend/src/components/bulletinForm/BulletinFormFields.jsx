export default function BulletinFormFields({
    formData,
    onInputChange,
    showDate = false,
}) {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Title <span className="text-red-600">*</span>
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter bulletin title"
                />
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Category <span className="text-red-600">*</span>
                </label>
                <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="e.g., General"
                />
            </div>

            <div>
                <label
                    htmlFor="author"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Author <span className="text-red-600">*</span>
                </label>
                <input
                    id="author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Author name"
                />
            </div>

            <div className="sm:col-span-2">
                <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                >
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows="7"
                    value={formData.message}
                    onChange={onInputChange}
                    className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Add bulletin details"
                />
            </div>

            {showDate && (
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Last Updated Date
                    </label>
                    <div className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                        {formData.date || "No date available"}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        Date is maintained by the backend and will refresh after
                        saving.
                    </p>
                </div>
            )}
        </div>
    );
}
