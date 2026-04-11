import { createContext, useContext, useEffect, useState } from "react";
import API_BASE_URL from "../config";

// Create AuthContext to manage authentication state and actions across the app
const AuthContext = createContext(null);

// Custom hook to easily access AuthContext values and functions
export function useAuth() {
    return useContext(AuthContext);
}

// AuthProvider component to wrap the app and provide authentication state and functions
export function AuthProvider({ children }) {
    // Initialize user from localStorage if available, otherwise null
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch (e) {
            return null;
        }
    });

    // Initialize token and refreshToken from localStorage if available, otherwise null
    const [token, setToken] = useState(
        () => localStorage.getItem("token") || null,
    );
    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem("refreshToken") || null,
    );

    // Every time token changes, update it in localStorage (or remove if null)
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Every time refreshToken changes, update it in localStorage (or remove if null)
    useEffect(() => {
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        else localStorage.removeItem("refreshToken");
    }, [refreshToken]);

    // Every time user changes, update it in localStorage (or remove if null)
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    // Login function to authenticate user and store token, refreshToken, and user info
    async function login({ email, password }) {
        // Make API call to login endpoint with email and password
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        // If login fails, throw an error
        if (!res.ok) {
            // Try to extract useful error information from the response body
            try {
                const ct = res.headers.get("content-type") || "";
                if (ct.includes("application/json")) {
                    const errBody = await res.json();
                    const errMsg = errBody.message || errBody.error || JSON.stringify(errBody);
                    throw new Error(errMsg);
                }

                const txt = await res.text();
                if (txt) throw new Error(txt);
            } catch (e) {
                // fall through to generic messages below
            }

            if (res.status >= 400 && res.status < 500) throw new Error("Invalid credentials");
            throw new Error("Server error logging in");
        }

        // If login succeeds, update authentication state
        const data = await res.json();

        setToken(data.token);
        setRefreshToken(data.refreshToken || null);
        setUser(data.user || null);

        // Return the full response data
        return data;
    }

    // Register function to create a new user account and log them in
    async function register({ name, email, password }) {
        // Make API call to users endpoint to create a new user account
        const res = await fetch(`${API_BASE_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        // If registration fails, throw an error with the message from the server
        if (!res.ok) {
            // Handling the case where server might return a non-JSON error response
            const err = async () => {
                try {
                    await res.json();
                } catch {
                    return { message: "Registration failed" };
                }
            };
            throw new Error(await err().message);
        }

        // If registration succeeds, log the user in with the same credentials
        const data = await res.json();
        setToken(data.token);
        setRefreshToken(data.refreshToken || null);
        setUser(data.user || null);

        // Return the full response data
        return data;
    }

    async function logout() {
        try {
            // If a refresh token exists, attempt to invalidate it on the server
            if (refreshToken) {
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } catch (e) {
            console.warn("Logout request failed:", e);
        }

        // Clear authentication state and localStorage
        setToken(null);
        setRefreshToken(null);
        setUser(null);
    }

    // Helper function to make authenticated API requests with the current token
    async function authFetch(url, options = {}) {
        // Include the Authorization header with the Bearer token if available
        const headers = options.headers ? { ...options.headers } : {};

        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Perform request
        return fetch(url, { ...options, headers }).then(async (res) => {
            // If unauthorized and we have a refresh token, try to refresh once
            if (res.status === 401 && refreshToken) {
                try {
                    const r = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken }),
                    });

                    if (r.ok) {
                        const data = await r.json();
                        if (data.token) setToken(data.token);
                        if (data.refreshToken) setRefreshToken(data.refreshToken);

                        // retry original request with new token
                        const retryHeaders = options.headers ? { ...options.headers } : {};
                        if (data.token) retryHeaders["Authorization"] = `Bearer ${data.token}`;
                        return fetch(url, { ...options, headers: retryHeaders });
                    }
                } catch (e) {
                    console.warn("Refresh attempt failed:", e);
                }
            }

            return res;
        });
    }

    const value = {
        user,
        token,
        refreshToken,
        login,
        register,
        logout,
        authFetch,
        // helper to update local user state after profile changes
        updateUser: (u) => setUser(u),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
