export default function Navbar() {
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
                    <li>
                        <a
                            href="/"
                            className="text-violet-500 hover:text-violet-800 hover:underline transition-colors ease-in-out duration-300"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/bulletins"
                            className="text-violet-500 hover:text-violet-800 hover:underline transition-colors ease-in-out duration-300"
                        >
                            Bulletin Board
                        </a>
                    </li>
                    <li>
                        <a
                            href="/about"
                            className="text-violet-500 hover:text-violet-800 hover:underline transition-colors ease-in-out duration-300"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="/add"
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
