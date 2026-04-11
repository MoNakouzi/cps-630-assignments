import { FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";

export default function MobileMenu({
    open,
    navItems = [],
    adminItems = [],
    user,
    logout,
    onClose,
}) {
    const navigate = useNavigate();
    const toast = useToast();
    const [confirmLogout, setConfirmLogout] = useState(false);

    return (
        <div
            className={`md:hidden z-50 absolute left-0 right-0 top-16 bg-white border-t shadow-md transform origin-top transition-all duration-400 ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
            style={{ transformOrigin: "top" }}
        >
            <div className="p-4">
                <ul className="space-y-3">
                    {user && user.role === "admin" && (
                        <>
                            {adminItems.map((a) => (
                                <li key={a.href}>
                                    <Link
                                        to={a.href}
                                        className="block text-gray-700 font-medium px-2 py-2 rounded hover:bg-gray-200 transition-colors"
                                        onClick={() => onClose && onClose()}
                                    >
                                        {a.name}
                                    </Link>
                                </li>
                            ))}
                            <hr className="border-t my-2" />
                        </>
                    )}

                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                className="block text-gray-700 font-medium px-2 py-2 rounded hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                    if (onClose) onClose();
                                }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}

                    <li>
                        {user ? (
                            <Link
                                to="/create"
                                className="block rounded bg-violet-500 px-3 py-2 text-white text-center hover:shadow-md hover:opacity-95 transition"
                                onClick={() => onClose && onClose()}
                            >
                                Add Item +
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="block rounded bg-violet-200 px-3 py-2 text-violet-700 text-center hover:bg-violet-300 transition"
                                onClick={() => onClose && onClose()}
                            >
                                Sign In / Register
                            </Link>
                        )}
                    </li>

                    {user ? (
                        <li>
                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-3 bg-violet-50 rounded-lg p-3">
                                    <div className="p-2 text-violet-700">
                                        <FiUser className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium text-slate-800">
                                                {user.name}
                                            </div>
                                            <span className="text-xs inline-flex items-center border border-gray-400 rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                                                {user.role === "admin"
                                                    ? "Admin account"
                                                    : "Regular account"}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 my-1">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    <button
                                        onClick={() => {
                                            if (onClose) onClose();
                                            navigate("/profile");
                                        }}
                                        className="w-full text-left px-2 py-2 rounded hover:bg-slate-50 transition"
                                    >
                                        Manage Account
                                    </button>
                                    {!confirmLogout ? (
                                        <button
                                            onClick={() =>
                                                setConfirmLogout(true)
                                            }
                                            className="fade-in w-full text-left px-2 py-2 rounded text-red-600 hover:bg-slate-50 transition"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <div className="fade-in">
                                            <div className="mb-2 text-sm font-medium text-gray-700">
                                                Confirm logout?
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        if (onClose) onClose();
                                                        try {
                                                            await logout();
                                                            toast.show(
                                                                "Logged out successfully!",
                                                                {
                                                                    type: "success",
                                                                },
                                                            );
                                                            navigate("/");
                                                        } catch (e) {
                                                            console.error(e);
                                                            toast.show(
                                                                "Error: Logout failed",
                                                                {
                                                                    type: "danger",
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    className="flex-1 rounded bg-red-600 px-3 py-2 text-white"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setConfirmLogout(false)
                                                    }
                                                    className="flex-1 rounded bg-slate-200 px-3 py-2"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ) : (
                        <li>
                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-3 bg-violet-50 rounded-lg p-3">
                                    <div className="p-2 text-violet-700">
                                        <FiUser className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-800">
                                            Guest Account
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Sign in to access more features.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
