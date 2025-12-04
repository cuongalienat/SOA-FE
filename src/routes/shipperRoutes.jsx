import ShipperDashboard from "../pages/Shipper/Dashboard.jsx";
import ShipperOrderDetail from "../pages/Shipper/OrderDetail.jsx";
import ShipperHistory from "../pages/Shipper/History.jsx";
import ShipperProfile from "../pages/Shipper/Profile.jsx";

import { Routes, Route, Navigate } from 'react-router-dom';
import ShipperLayout from '../components/layout/ShipperLayout.jsx';

const ShipperRoutes = () => {
    return (
        <ShipperLayout>
            <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="/dashboard" element={<ShipperDashboard />} />
                <Route path="/history" element={<ShipperHistory />} />
                <Route path="/profile" element={<ShipperProfile />} />
                <Route path="/order/:id" element={<ShipperOrderDetail />} />
            </Routes>
        </ShipperLayout>
    );
};

export default ShipperRoutes;