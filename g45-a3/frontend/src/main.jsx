import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./css/index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* Browser Router wraps the entire application since Routes is used within App */}
        <BrowserRouter>
            {/* ToastProvider and AuthProvider wrap the app to provide toasts and auth across components */}
            <ToastProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    </StrictMode>,
);
