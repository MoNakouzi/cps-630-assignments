import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";
import BulletinLoading from "../components/general/BulletinLoading";
import PasswordField from "../components/general/PasswordField";
import { useToast } from "../context/ToastContext";

export default function Profile() {
    // Get the current user, authFetch function, and updateUser function from AuthContext
    const { user, authFetch, updateUser } = useAuth();

    // useNavigate hook from react-router-dom to navigate between routes
    const navigate = useNavigate();

    // Manage states for loading, saving, error messages
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    // Local state for profile form and password change form
    const [form, setForm] = useState({ name: "", email: "" });
    const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });

    useEffect(() => {
        async function load() {
            // If user is not logged in, redirect to login page
            if (!user) {
                navigate("/login");
                return;
            }

            setLoading(true);
            setError("");

            // Fetch the user's profile data to pre-fill the form
            try {
                // Use authFetch to make a call with the authentication token included
                const res = await authFetch(`${API_BASE_URL}/api/users/${user.id}`);

                if (!res.ok) {
                    throw new Error("Failed to load profile");
                }

                const data = await res.json();
                setForm({ name: data.name || "", email: data.email || "" });
            } catch (err) {
                console.error(err);
                setError(err.message || "Could not load profile");
                toast.show("Could not load profile", { type: "danger" });
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user]);

    // Validate email structure
    function validateEmail(e) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(e).toLowerCase());
    }

    // Handle profile form submission to update user's name and email
    async function handleProfileSave(e) {
        e.preventDefault();
        setError("");

        // Ensure name is not empty and email is valid before making API call
        if (!form.name.trim()) { 
            return setError("Name is required");
        }
        if (!validateEmail(form.email)) {
            return setError("Enter a valid email address");
        }

        setSaving(true);
        try {
            // Make authenticated API call to update the user's profile information
            const res = await authFetch(`${API_BASE_URL}/api/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
            });

            // If fail, get error message from response and throw an error to be caught below
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to update profile");
            }

            const updated = await res.json();
            // update local user state
            updateUser({ ...user, name: updated.name, email: updated.email });

            toast.show("Profile updated", { type: "success" });
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not update profile");
            toast.show(err.message || "Could not update profile", { type: "danger" });
        } finally {
            setSaving(false);
        }
    }

    // Handle password change form submission to update user's password
    async function handlePasswordChange(e) {
        e.preventDefault();
        setError("");

        // Validate password length and match before making API call
        if (!pwForm.newPassword || pwForm.newPassword.length < 8) {
            return setError("New password must be at least 8 characters long.");
        }
        if (pwForm.newPassword !== pwForm.confirm) {
            return setError("New password and confirmation do not match.");
        }

        setSaving(true);

        try {
            // Make authenticated API call to change the user's password, sending old and new passwords
            const res = await authFetch(`${API_BASE_URL}/api/users/${user.id}/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }),
            });

            // If fail, get error message from response and throw an error to be caught below
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to change password");
            }

            alert("Password updated successfully");
            setPwForm({ oldPassword: "", newPassword: "", confirm: "" });
            toast.show("Password updated successfully", { type: "success" });
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not change password");
            toast.show(err.message || "Could not change password", { type: "danger" });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <BulletinLoading />;

    return (
        <main className="mx-auto min-h-screen max-w-3xl p-6 sm:p-12 fade-in">
            <div className="mx-auto bg-white rounded-lg p-6 shadow">
                <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            value={form.email}
                            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button disabled={saving} className="rounded bg-violet-500 px-4 py-2 text-white">{saving ? "Saving..." : "Save Profile"}</button>
                        <button onClick={() => { setForm({ name: user.name || "", email: user.email || "" }); setError(""); }} type="button" className="rounded bg-slate-200 px-4 py-2">Reset</button>
                    </div>
                </form>

                <hr className="my-6" />

                <h2 className="text-lg font-semibold mb-3">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <PasswordField
                            label="Current Password"
                            name="oldPassword"
                            value={pwForm.oldPassword}
                            onChange={(e) => setPwForm((s) => ({ ...s, oldPassword: e.target.value }))}
                        />
                    </div>

                    <div>
                        <PasswordField
                            label="New Password"
                            name="newPassword"
                            value={pwForm.newPassword}
                            onChange={(e) => setPwForm((s) => ({ ...s, newPassword: e.target.value }))}
                        />
                    </div>

                    <div>
                        <PasswordField
                            label="Confirm New Password"
                            name="confirm"
                            value={pwForm.confirm}
                            onChange={(e) => setPwForm((s) => ({ ...s, confirm: e.target.value }))}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button disabled={saving} className="rounded bg-violet-500 px-4 py-2 text-white">{saving ? "Working..." : "Change Password"}</button>
                        <button onClick={() => { setPwForm({ oldPassword: "", newPassword: "", confirm: "" }); setError(""); }} type="button" className="rounded bg-slate-200 px-4 py-2">Reset</button>
                    </div>
                </form>
            </div>
        </main>
    );
}
