import { Routes, Route, Navigate } from "react-router-dom";
import ROUTES from "./constants/routes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.default} element={<Home />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.register} element={<Register />} />

      {/* Alias Routes */}
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.default} />} />

      {/* 404 Route */}
      <Route path="*" element={<h1>404 NOT FOUND</h1>} />
    </Routes>
  );
};

export default AppRoutes;
