import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";

function ToastItem({ t, onRemove }) {
    const [shrunk, setShrunk] = useState(false);

    useEffect(() => {
        // start the shrink animation on mount so the bar decreases to 0
        const id = setTimeout(() => setShrunk(true), 50);
        return () => clearTimeout(id);
    }, []);

    const accent =
        t.type === "success"
            ? "bg-emerald-500"
            : t.type === "danger"
              ? "bg-red-500"
              : "bg-violet-500";

    return (
        <div
            key={t.id}
            role="status"
            className="max-w-sm w-full transform transition-all duration-300"
        >
            <div className="relative rounded-lg bg-white border border-gray-400 shadow p-3 pl-4 pr-3 overflow-hidden">
                {/* left accent bar */}
                <span
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent} rounded-l-md`}
                />

                <div className="flex items-start gap-3 ml-3">
                    <div className="mt-0.5 text-2xl">
                        {t.type === "success" ? (
                            <FiCheckCircle className="text-emerald-500" />
                        ) : t.type === "danger" ? (
                            <FiXCircle className="text-red-500" />
                        ) : (
                            <FiInfo className="text-violet-600" />
                        )}
                    </div>

                    <div
                        className={`flex-1 text-sm ${t.type === "info" ? "text-slate-800" : "text-slate-800"}`}
                    >
                        {t.msg}
                    </div>

                    <button
                        onClick={() => onRemove(t.id)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                    >
                        <IoIosClose className="h-5 w-5" />
                    </button>
                </div>

                {/* progress bar */}
                <div className="absolute left-0 right-0 bottom-0 h-1 bg-slate-100">
                    <div
                        className={`${accent} h-1 rounded-b`}
                        style={{
                            width: shrunk ? "0%" : "100%",
                            transition: `width ${t.duration || 6000}ms linear`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ToastContainer({ toasts = [], onRemove = () => {} }) {
    return (
        <div
            className="fixed right-4 top-6 z-50 flex flex-col gap-3"
            aria-live="polite"
        >
            {toasts.map((t) => (
                <ToastItem key={t.id} t={t} onRemove={onRemove} />
            ))}
        </div>
    );
}
