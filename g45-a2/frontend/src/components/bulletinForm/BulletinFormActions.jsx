export default function BulletinFormActions({
    submitLabel,
    submittingLabel,
    submitting,
    onCancel,
    cancelLabel = "Cancel",
}) {
    return (
        <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                disabled={submitting}
            >
                {cancelLabel}
            </button>

            <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-violet-700 hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting ? submittingLabel : submitLabel}
            </button>
        </div>
    );
}
