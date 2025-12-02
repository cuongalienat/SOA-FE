import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantLayout from "../components/layout/RestaurantLayout.jsx";
import Dashboard from "../pages/Restaurant/Dashboard.jsx";
import Menu from "../pages/Restaurant/Menu.jsx";
import Orders from "../pages/Restaurant/Orders.jsx";
import Settings from "../pages/Restaurant/Settings.jsx";


const RestaurantRoutes = () => {
    return (
        <RestaurantLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />           {/* /restaurant */}
                <Route path="/dashboard" element={<Dashboard />} />  {/* /restaurant/dashboard */}
                <Route path="/menu" element={<Menu />} />            {/* /restaurant/menu */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </RestaurantLayout>
    );
};

export default RestaurantRoutes;