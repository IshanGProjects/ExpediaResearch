import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Alias Routes */}
            <Route path="/home" element={<Navigate to="/" />} />

            {/* 404 Route */}
            <Route path="*" element={<h1>404 NOT FOUND</h1>} />
        </Routes>
    );
};

export default AppRoutes;