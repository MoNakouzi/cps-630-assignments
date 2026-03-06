export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-violet-900">
                        Campus Bulletin Board
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-violet-700 font-light">
                        Explore our content and discover amazing opportunities
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-8">
                    <button className="px-8 py-3 sm:py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        About Us
                    </button>
                    <button className="px-8 py-3 sm:py-4 bg-white border-2 border-violet-600 text-violet-600 hover:bg-violet-50 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        See Bulletin
                    </button>
                </div>

                <div className="pt-8 text-sm text-violet-600">
                    <p>Get started by choosing an option above</p>
                </div>
            </div>
        </div>
    );
}