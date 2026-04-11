import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PasswordField from "../components/general/PasswordField";

export default function Register() {
    const navigate = useNavigate();
    // Get the register function from AuthContext
    const { register } = useAuth();

    // Local state for name, email, password, and error message
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const toast = useToast();

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
            toast.show("Account created", { type: "success" });
            navigate("/");
        } catch (err) {
            const msg = err?.message || "Registration failed";
            setError(msg);
            toast.show(msg, { type: "danger" });
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

                <form onSubmit={handleSubmit} className="space-y-4 sm:min-w-md">
                    <PasswordField
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        placeholder="Name"
                    />
                    <PasswordField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        placeholder="Email"
                    />
                    <PasswordField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        placeholder="Password"
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
