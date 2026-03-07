export default function BulletinLoading() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-violet-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-violet-200 bg-white p-8 shadow-sm text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                    Loading Bulletin
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    Please wait while we retrieve the bulletin details.
                </p>
            </div>
        </section>
    );
}
