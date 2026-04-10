export default function BulletinFormShell({
    title,
    description,
    error,
    children,
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-xl">
            <div className="border-b border-violet-200 bg-linear-to-r from-violet-50 to-white px-8 py-6 sm:px-10">
                <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                <p className="mt-2 text-slate-600">{description}</p>
            </div>

            <div className="px-8 py-6 sm:px-10">
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {children}
            </div>
        </section>
    );
}
