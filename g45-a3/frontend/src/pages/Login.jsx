import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import InputField from "../components/general/InputField";

export default function Login() {
    const navigate = useNavigate();
    // Get the location object to determine where the user was trying to go before being redirected to login
    const location = useLocation();
    // Get the login function from AuthContext to perform login action
    const { login } = useAuth();
    const toast = useToast();

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
            const msg = err?.message || "Login failed";
            setError(msg);
            toast.show(msg, { type: "danger", duration: 6000 });
        }
    }

    return (
        <div className="min-h-screen flex items-center p-6 sm:p-12 fade-in">
            <div className="mx-auto max-w-lg bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-1">
                    Campus Bulletins Login
                </h2>
                <p className="text-gray-400 mb-4">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-sm text-violet-600 hover:underline"
                    >
                        Register here
                    </Link>
                    .
                </p>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 sm:min-w-md">
                    <InputField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        placeholder="Email"
                    />
                    <InputField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        placeholder="Password"
                    />
                    <div className="flex justify-center items-center">
                        <button className="rounded bg-violet-500 text-white px-4 py-2 hover:bg-violet-600">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
