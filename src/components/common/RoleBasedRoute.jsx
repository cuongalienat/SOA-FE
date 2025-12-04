// components/common/RoleBasedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuths';

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    console.log("--> RoleBasedRoute đang chạy kiểm tra cho:", location.pathname);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Đang tải quyền...</div>;
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // Database bạn lưu là 'restaurant_manager' hay 'restaurant'? Check kỹ log
    if (!allowedRoles.includes(user.role)) {
        console.warn(`Bị chặn! User role: ${user.role}. Yêu cầu: ${allowedRoles}`);
        return <Navigate to="/" replace />;
    }

    // ✅ SỬA Ở ĐÂY: Nếu có children thì render children, không thì render Outlet
    return children ? children : <Outlet />;
};

export default RoleBasedRoute;