import { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "../components/general/Toast";

// Create ToastContext to manage toast notifications across the app
const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // Function to show a new toast notification with a message, type, and duration
    const show = useCallback((msg, { type = "info", duration = 4000 } = {}) => {
        // Generate a unique ID for the toast and add it to the list of toasts
        const id = Date.now() + Math.random();

        // Add the new toast to the state, and set a timeout to remove it after the specified duration
        setToasts((t) => [...t, { id, msg, type }]);

        // Automatically remove the toast after the specified duration
        if (duration > 0) {
            setTimeout(
                () => setToasts((t) => t.filter((x) => x.id !== id)),
                duration,
            );
        }

        return id;
    }, []);

    // Function to remove a toast notification by its ID
    const remove = useCallback(
        (id) => setToasts((t) => t.filter((x) => x.id !== id)),
        [],
    );

    return (
        <ToastContext.Provider value={{ show, remove }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={remove} />
        </ToastContext.Provider>
    );
}

export default ToastContext;
