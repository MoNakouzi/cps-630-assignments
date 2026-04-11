import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAdmin({ children }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            // not logged in -> redirect to login
            navigate("/login", { state: { from: location }, replace: true });
            return;
        }

        if (user.role !== "admin") {
            // logged in but not admin -> redirect to home
            navigate("/", { replace: true });
        }
    }, [user]);

    if (!user) return null; // navigation will redirect
    if (user.role !== "admin") return null;

    return children;
}
