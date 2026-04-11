import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

        // Password requirements: 8+ chars, at least 1 uppercase, at least 1 special char
        const passReq =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passReq.test(password)) {
            setError(
                "Password must be at least 8 characters, include an uppercase letter and a special character.",
            );
            return;
        }

        try {
            await register({ name, email, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center p-6 sm:p-12 fade-in">
            <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Register</h2>
                <p className="text-gray-400 mb-4">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-sm text-violet-600 hover:underline"
                    >
                        Sign in here
                    </Link>
                    .
                </p>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Name"
                        value={name}
                        name="name"
                        autoComplete="name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Email"
                        value={email}
                        name="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Password"
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Password must be at least 8 characters, include at least
                        1 uppercase letter and a 1 special character.
                    </p>
                    <div className="flex justify-center items-center">
                        <button className="rounded bg-violet-500 text-white px-4 py-2">
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
