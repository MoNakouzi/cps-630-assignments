import { Link } from "react-router-dom";

export default function BulletinNotFound({ id }) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-10">
            <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
                <div className="border-b border-violet-100 bg-violet-50 px-6 py-4">
                    <h1 className="text-lg font-semibold text-slate-900">
                        Bulletin not found
                    </h1>
                </div>

                <div className="px-6 py-6">
                    <p className="text-sm leading-6 text-slate-700">
                        The bulletin you are looking for (ID = {id}) may have been removed
                        or the link may be invalid.
                    </p>

                    <div className="mt-6">
                        <Link
                            to="/bulletins"
                            className="inline-flex rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                        >
                            Back to Bulletins
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
