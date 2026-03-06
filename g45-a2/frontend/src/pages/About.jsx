export default function About() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-10 min-h-screen">
            <section className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
                <p className="mt-2 text-sm text-slate-600">
                    CPS 630 - Assignment 2: CRUD Application
                </p>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-violet-700">
                        Group Members - Group 45
                    </h2>

                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-700">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">
                                        Student Number
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr className="bg-white">
                                    <td className="px-4 py-3">Viri Nguyen</td>
                                    <td className="px-4 py-3">501132181</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="px-4 py-3">Mo Nakouzi</td>
                                    <td className="px-4 py-3">501094772</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="px-4 py-3">Kai Adams</td>
                                    <td className="px-4 py-3">501080302</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="px-4 py-3">Arnab Nath</td>
                                    <td className="px-4 py-3">501165959</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
