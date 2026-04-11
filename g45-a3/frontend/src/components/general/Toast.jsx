import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

export default function ToastContainer({ toasts = [], onRemove = () => {} }) {
    return (
        <div className="fixed right-4 top-6 z-50 flex flex-col gap-3">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`max-w-sm w-full flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md transform transition-all duration-300 bg-white ${t.type === "success" ? "border-green-200" : t.type === "danger" ? "border-red-200" : "border-slate-200"}`}
                    role="status"
                >
                    <div className="mt-0.5 text-2xl text-slate-700">
                        {t.type === "success" ? <FiCheckCircle className="text-green-500" /> : t.type === "danger" ? <FiXCircle className="text-red-500" /> : <FiInfo className="text-violet-500" />}
                    </div>
                    <div className="flex-1 text-sm text-slate-800">{t.msg}</div>
                    <button onClick={() => onRemove(t.id)} className="text-slate-400 hover:text-slate-600 ml-2">✕</button>
                </div>
            ))}
        </div>
    );
}
