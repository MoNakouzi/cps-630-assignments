import { useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const adminDetailsRef = useRef(null);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Bulletin Board", href: "/bulletins" },
        { name: "About", href: "/about" },
    ];

    const adminItems = [
        { name: "Admin Dashboard", href: "/admin" },
        { name: "Manage Categories", href: "/admin/categories" },
        { name: "View Users", href: "/admin/users" },
    ];

    return (
        <header className="border-b bg-white">
            <nav className="relative mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:text-violet-700 transition-colors ease-in-out duration-300"
                >
                    <img
                        className="h-8 w-8 rounded-full bg-linear-to-b from-violet-300 to-violet-400 object-fill"
                        src="/icon.png"
                    />
                    Campus Bulletin Board
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-700">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `px-2 py-1 rounded ${
                                        isActive
                                            ? "bg-violet-50 text-violet-700"
                                            : "text-slate-700 hover:text-violet-800"
                                    } transition-colors`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        {user ? (
                            <Link
                                to="/create"
                                className="rounded-lg bg-violet-500 px-3 py-2 text-white hover:bg-violet-700 transition-colors shadow-sm"
                            >
                                Add Item +
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded-lg bg-violet-200 px-3 py-2 text-violet-700 hover:bg-violet-300"
                            >
                                Sign In
                            </Link>
                        )}
                    </li>

                    {user && user.role === "admin" && (
                        <li>
                            <div className="relative">
                                <details
                                    className="group"
                                    ref={adminDetailsRef}
                                >
                                    <summary className="list-none cursor-pointer rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200">
                                        Admin
                                    </summary>
                                    <div className="absolute right-0 mt-2 w-44 rounded-md bg-white ring-1 ring-black ring-opacity-5 shadow-lg z-50">
                                        <ul className="p-2 text-sm">
                                            {adminItems.map((a) => (
                                                <li
                                                    key={a.href}
                                                    className="mb-1"
                                                >
                                                    <Link
                                                        to={a.href}
                                                        className="block px-2 py-1 rounded hover:bg-slate-50"
                                                        onClick={() =>
                                                            adminDetailsRef.current?.removeAttribute(
                                                                "open",
                                                            )
                                                        }
                                                    >
                                                        {a.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </details>
                            </div>
                        </li>
                    )}

                    {user && (
                        <li>
                            <ProfileMenu user={user} logout={logout} />
                        </li>
                    )}
                </ul>

                {/* Mobile controls */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={() => setOpen((s) => !s)}
                        aria-label="Toggle menu"
                        className="p-2 text-slate-700"
                    >
                        {open ? (
                            <FiX className="h-6 w-6" />
                        ) : (
                            <FiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile menu panel */}
                <MobileMenu
                    open={open}
                    navItems={navItems}
                    adminItems={adminItems}
                    user={user}
                    logout={logout}
                    onClose={() => setOpen(false)}
                />
            </nav>
        </header>
    );
}
