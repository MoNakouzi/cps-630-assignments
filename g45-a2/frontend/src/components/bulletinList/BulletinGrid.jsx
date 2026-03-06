export default function BulletinGrid({ bulletins }) {
    return (
        <section id="bulletinGrid" className="masonry">
            {bulletins.map((b) => (
                <article key={b._id} className="masonry-item rounded-2xl border border-violet-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-semibold leading-6 text-slate-900">
                            {b.title}
                        </h2>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                            {b.category}
                        </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-6">
                        {b.message}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium text-slate-600">
                            {b.author}
                        </span>
                        <span>{b.date}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-start gap-3">
                        <a
                            href="/edit?id={b.id}"
                            className="text-xs rounded-lg bg-violet-500 px-3 py-2 text-white hover:bg-violet-700 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md"
                        >
                            Edit
                        </a>
                        <a
                            href="/delete?id={b.id}"
                            className="text-xs rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md"
                        >
                            Delete
                        </a>
                    </div>
                </article>
            ))}
        </section>
    );
}
