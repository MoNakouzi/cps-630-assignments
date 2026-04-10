import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    // Get the register function from AuthContext
    const { register } = useAuth();

    // Local state for name, email, password, and error message
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Handle registration form submission
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        
        try {
            await register({ name, email, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-screen p-6 sm:p-12">
            <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Register</h2>
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                        <button className="rounded bg-violet-500 text-white px-4 py-2">Create account</button>
                        <a href="/login" className="text-sm text-violet-600 hover:underline">Already have an account?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
