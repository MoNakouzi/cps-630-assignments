import { IoWarningOutline } from "react-icons/io5";

export default function NotFound() {
    return (
        <div className="rounded-xl p-8 text-center min-h-[80vh] flex flex-col items-center justify-center gap-4">
            <IoWarningOutline className="text-6xl text-violet-500" />
            <h1 className="text-3xl font-bold text-slate-900">
                404 - Page Not Found
            </h1>
            <p className="mt-2 text-sm text-slate-600">
                The page you're looking for doesn't exist (or was moved).
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
                <a
                    href="/"
                    className="rounded-lg bg-violet-500 px-4 py-2 text-white hover:bg-violet-700 transition"
                >
                    Go Home
                </a>
                <a
                    href="/about"
                    className="rounded-lg bg-slate-200 px-4 py-2 text-slate-900 hover:bg-slate-300 transition"
                >
                    About
                </a>
            </div>
        </div>
    );
}
