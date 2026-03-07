export default function Navbar() {
    // Defining nav items in an array for easy management and scalability
    const navItems = [
        { name: "Home", href: "/" },
        { name: "Bulletin Board", href: "/bulletins" },
        { name: "About", href: "/about" },
    ];
    return (
        <header className="border-b bg-white">
            <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-y-4 sm:flex-row items-center justify-between">
                <a
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:text-violet-700 transition-colors ease-in-out duration-300"
                >
                    <img
                        className="h-8 w-8 rounded-full bg-linear-to-b from-violet-300 to-violet-400 object-fill"
                        src="/icon.png"
                    />
                    Campus Bulletin Board
                </a>
                <ul className="flex items-center gap-5 text-sm font-medium text-slate-700">
                    {/* Looping through nav items to display them */}
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className="text-violet-500 hover:text-violet-800 hover:underline transition-colors ease-in-out duration-300"
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href="/create"
                            className="rounded-lg bg-violet-500 px-3 py-2 text-white hover:bg-violet-700 transition-colors ease-in-out duration-300 shadow-sm hover:shadow-md"
                        >
                            Add Item +
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
