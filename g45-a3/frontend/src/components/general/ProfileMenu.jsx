import { useState, useRef, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export default function ProfileMenu({ user, logout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        function onDoc(e) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    async function handleLogout() {
        try {
            await logout();
            toast.show("Logged out", { type: "success" });
            navigate("/");
        } catch (e) {
            console.error(e);
            toast.show("Logout failed", { type: "danger" });
        }
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((s) => !s)}
                title={user?.name || "Profile"}
                aria-label={user?.name ? `Profile for ${user.name}` : "Profile"}
                className="flex items-center gap-2 rounded-full bg-violet-200 p-2 text-violet-700 hover:bg-violet-300 hover:text-violet-900 transition-colors"
            >
                <FiUser className="h-5 w-5" />
                <span className="hidden lg:inline text-sm font-medium">
                    {user?.name}
                </span>
            </button>

            <div
                className={`absolute right-0 mt-3 w-48 rounded-md bg-white ring-1 ring-black ring-opacity-5 shadow-lg p-3 z-40 transform origin-top-right transition-all duration-200 ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            >
                <div className="mb-2 text-xs font-medium text-slate-700">
                    {user?.name}'s Account
                </div>
                <hr className="border-violet-200 py-1" />
                <button
                    onClick={() => {
                        setOpen(false);
                        navigate("/profile");
                    }}
                    className="w-full mb-1 text-left px-2 py-2 rounded hover:bg-violet-100 text-sm text-violet-700 transition-colors ease-in-out duration-300"
                >
                    Manage Account
                </button>
                <button
                    onClick={() => {
                        setOpen(false);
                        handleLogout();
                    }}
                    className="w-full text-left px-2 py-2 rounded text-red-600 hover:bg-red-100 transition-colors ease-in-out duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
