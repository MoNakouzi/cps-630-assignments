import { IoSearch } from "react-icons/io5";

export default function SearchBulletins({
    searchTerm,
    onSearchTermChange,
    searchField,
    onSearchFieldChange,
}) {
    return (
        <section className="bg-white border border-violet-200 rounded-xl p-4 shadow-sm w-full">
            <div className="flex flex-col gap-3">
                <label
                    htmlFor="search"
                    className="text-sm font-medium text-slate-700 flex items-center"
                >
                    <IoSearch className="inline-block mr-2" />
                    Search Bulletins
                </label>

                <div className="flex flex-col gap-3 md:flex-row text-violet-500 font-semibold">
                    <select
                        id="search-field"
                        value={searchField}
                        onChange={(e) => onSearchFieldChange(e.target.value)}
                        className="rounded-lg min-w-24 border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 md:w-3/4"
                    >
                        <option value="any">All Fields</option>
                        <option value="title">Title</option>
                        <option value="category">Category</option>
                        <option value="author">Author</option>
                    </select>

                    <input
                        type="text"
                        id="search"
                        placeholder="Enter search term..."
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="rounded-lg min-w-24 text-gray-900 border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 md:w-3/4"
                    />
                </div>

                {searchField === "any" && (
                    <div className="flex flex-col gap-3 my-2 md:flex-row justify-between">
                        <p className="text-xs text-violet-600 font-semibold">
                            Searching across: title, category, and author.
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            Note: search results are case-insensitive and allows partial (not fuzzy) matches.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
