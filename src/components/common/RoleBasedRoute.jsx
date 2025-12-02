// src/components/common/RoleBasedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Hook lấy user hiện tại

const RoleBasedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }
    console.log("Current User Role:", user.role);

    // 1. Chưa đăng nhập -> Đá về trang đăng nhập
    // 2. Sai quyền -> Đá về trang chủ hoặc trang 403
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Hoặc to="/"
    }

    // 3. Đúng quyền -> Cho phép hiển thị các Route con
    return <Outlet />;
};

export default RoleBasedRoute;