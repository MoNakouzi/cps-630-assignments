export default function EditBulletinErrorState({ error, onBackToBoard }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
                type="button"
                onClick={onBackToBoard}
                className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
                Back to Board
            </button>
        </div>
    );
}
