export default function Home() {
    return (
        <div className="min-h-screen bg-linear-to-br from-violet-200 via-violet-100 to-violet-300 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full text-center space-y-12 my-26">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-violet-900">
                        Campus Bulletin Board
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-violet-600 font-light">
                        news, events, announcements, and more
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <a
                        href="/bulletins"
                        className="px-8 py-4 sm:py-5 bg-linear-to-r from-violet-600 to-violet-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                    >
                        View Board
                    </a>
                    <a
                        href="/create"
                        className="px-8 py-4 sm:py-5 bg-white text-violet-600 border border-violet-600 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                    >
                        Create a Bulletin
                    </a>
                </div>

                <div className="mt-12 p-8 sm:p-10 bg-white rounded-xl shadow-lg border-2 border-violet-100 flex flex-col items-center justify-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-violet-800">
                        About Us
                    </h2>
                    <p className="mt-2 text-base sm:text-lg text-violet-500 max-w-2xl mx-auto">
                        A bulletin for students, made by students.
                    </p>
                    <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl w-3/4 mx-auto italic">
                        Meet the team that created this site!
                    </p>
                    <a
                        href="/about"
                        className="mt-6 px-6 py-2 bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl shadow-lg"
                    >
                        See more
                    </a>
                </div>
            </div>
        </div>
    );
}
