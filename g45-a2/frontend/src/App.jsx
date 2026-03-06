import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    )
}