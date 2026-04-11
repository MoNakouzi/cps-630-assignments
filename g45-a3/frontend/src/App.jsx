import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/general/Navbar.jsx";
import Footer from "./components/general/Footer.jsx";
import RequireAuth from "./components/general/RequireAuth";
import RequireAdmin from "./components/general/RequireAdmin";

// Public pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BulletinBoard from "./pages/BulletinBoard.jsx";
import BulletinDetail from "./pages/BulletinDetail.jsx";

// Auth pages
import CreateBulletin from "./pages/CreateBulletin.jsx";
import EditBulletin from "./pages/EditBulletin.jsx";
import DeleteBulletin from "./pages/DeleteBulletin.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
    return (
        <div className="app bg-violet-100 min-h-screen flex flex-col">
            {/* Navbar is placed at the top of all pages */}
            <Navbar />
            <div>
                {/* Routing different pages */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bulletins" element={<BulletinBoard />} />
                    <Route path="/bulletins/:id" element={<BulletinDetail />} />
                    {/* Require authentication for create, edit, and delete routes */}
                    <Route
                        path="/create"
                        element={
                            <RequireAuth>
                                <CreateBulletin />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <RequireAuth>
                                <EditBulletin />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/delete/:id"
                        element={
                            <RequireAuth>
                                <DeleteBulletin />
                            </RequireAuth>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <Profile />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <RequireAdmin>
                                <AdminDashboard />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/admin/categories"
                        element={
                            <RequireAdmin>
                                <AdminCategories />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <RequireAdmin>
                                <AdminUsers />
                            </RequireAdmin>
                        }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            {/* Footer is placed at the bottom of all pages */}
            <Footer />
        </div>
    );
}
