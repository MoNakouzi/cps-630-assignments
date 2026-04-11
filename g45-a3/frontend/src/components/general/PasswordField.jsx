import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordField({
    value,
    onChange,
    name = "password",
    placeholder = "",
    label = "Password",
    required = false,
}) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="mt-1 relative">
                <input
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded border px-3 py-2 pr-10"
                />
                {/* Show password toggle */}
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-2 text-slate-600"
                >
                    {show ? <FiEyeOff /> : <FiEye />}
                </button>
            </div>
        </div>
    );
}
