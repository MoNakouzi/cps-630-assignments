import { FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function MobileMenu({ open, navItems = [], adminItems = [], user, logout }) {
    const navigate = useNavigate();

    return (
        <div className={`md:hidden z-50 absolute left-0 right-0 top-16 bg-white border-t shadow-md transform origin-top transition-all duration-200 ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`} style={{ transformOrigin: 'top' }}>
            <div className="p-4">
                <ul className="space-y-3">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link to={item.href} className="block text-slate-700 font-medium" onClick={() => { /* close handled in parent */ }}>
                                {item.name}
                            </Link>
                        </li>
                    ))}

                    <li>
                        {user ? (
                            <Link to="/create" className="block rounded bg-violet-500 px-3 py-2 text-white text-center">Add Item +</Link>
                        ) : (
                            <Link to="/login" className="block rounded bg-violet-200 px-3 py-2 text-violet-700 text-center">Sign In / Register</Link>
                        )}
                    </li>

                    {user && (
                        <li>
                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 text-violet-700"><FiUser className="h-5 w-5" /></div>
                                    <div>
                                        <div className="font-medium text-slate-800">{user.name}</div>
                                        <div className="text-sm text-slate-600">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    <button onClick={() => navigate('/profile')} className="w-full text-left px-2 py-2 rounded hover:bg-slate-50">Manage Account</button>
                                    <button onClick={() => logout()} className="w-full text-left px-2 py-2 rounded text-red-600 hover:bg-slate-50">Logout</button>
                                </div>
                            </div>
                        </li>
                    )}

                    {user && user.role === 'admin' && (
                        <>
                            <li className="pt-2 border-t">
                                <div className="text-sm font-semibold text-slate-700">Admin</div>
                            </li>
                            {adminItems.map((a) => (
                                <li key={a.href}>
                                    <Link to={a.href} className="block pl-2 text-slate-700">{a.name}</Link>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
