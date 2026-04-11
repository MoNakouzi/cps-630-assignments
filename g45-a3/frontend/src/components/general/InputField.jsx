import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

// General input component. When `type` is "password" it shows a visibility toggle.
export default function InputField({
    value,
    onChange,
    name = "input",
    placeholder = "",
    label = "",
    required = false,
    type = "text",
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
        <div>
            {label ? (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            ) : null}

            <div className="mt-1 relative">
                <input
                    name={name}
                    type={isPassword && show ? "text" : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-12 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-colors"
                />

                {isPassword ? (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 transition"
                    >
                        {show ? <FiEye /> : <FiEyeOff />}
                    </button>
                ) : null}
            </div>
        </div>
    );
}
