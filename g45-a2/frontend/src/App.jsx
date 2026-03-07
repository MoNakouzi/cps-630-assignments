import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BulletinList from "./pages/BulletinList.jsx";
import BulletinDetail from "./pages/BulletinDetail.jsx";
import CreateBulletin from "./pages/CreateBulletin.jsx";
import EditBulletin from "./pages/EditBulletin.jsx";
import DeleteBulletin from "./pages/DeleteBulletin.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/general/Navbar.jsx";
import Footer from "./components/general/Footer.jsx";

export default function App() {
    return (
        <div className="app bg-violet-100 min-h-screen flex flex-col">
            {/* Navbar is placed at the top of all pages */}
            <Navbar />
            <div>
                {/* Routing different pages */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bulletins" element={<BulletinList />} />
                    <Route path="/bulletins/:id" element={<BulletinDetail />} />
                    <Route path="/create" element={<CreateBulletin />} />
                    <Route path="/edit/:id" element={<EditBulletin />} />
                    <Route path="/delete/:id" element={<DeleteBulletin />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            {/* Footer is placed at the bottom of all pages */}
            <Footer />
        </div>
    );
}
