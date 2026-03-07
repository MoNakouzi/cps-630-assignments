export default function DeleteBulletinPreview({ bulletin }) {
    if (!bulletin) {
        return <p>No bulletin selected</p>;
    }

    return (
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
            <h2 className="font-bold text-slate-900">{bulletin.title}</h2>

            {bulletin.category && (
                <p className="mt-1 text-xs text-slate-500">
                    Category: {bulletin.category}
                </p>
            )}

            {bulletin.author && (
                <p className="mt-2 text-xs text-slate-500">
                    By {bulletin.author}
                </p>
            )}
        </div>
    );
}