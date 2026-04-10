import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    // Get the location object to determine where the user was trying to go before being redirected to login
    const location = useLocation();
    // Get the login function from AuthContext to perform login action
    const { login } = useAuth();

    // Local state for email, password, and error message
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Determine the path to redirect to after successful login (default to home page)
    const from = location.state?.from?.pathname || "/";

    // Handle login form submission
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen p-6 sm:p-12">
            <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <button className="rounded bg-violet-500 text-white px-4 py-2">Sign in</button>
                        <a href="/register" className="text-sm text-violet-600 hover:underline">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
