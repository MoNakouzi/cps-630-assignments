import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

// Component to protect routes that require authentication
export default function RequireAuth({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return (
            <Navigate 
                to="/login" 
                state={{ from: location }} 
                replace 
            />
        );
    }

    return children;
}
