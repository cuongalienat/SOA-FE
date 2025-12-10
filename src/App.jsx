import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import RoleBasedRoute from "./components/common/RoleBasedRoute";
import { ToastProvider } from "./context/ToastContext.jsx";

const ClientRoutes = React.lazy(() => import("./routes/customerRoutes.jsx"));
const RestaurantRoutes = React.lazy(() => import("./routes/shopRoutes.jsx"));
const ShipperRoutes = React.lazy(() => import("./routes/shipperRoutes.jsx"));

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <HashRouter>
            {/* Suspense để hiện loading khi đang tải các file route con */}
            <Suspense
              fallback={
                <div className="h-screen flex items-center justify-center">
                  Loading app...
                </div>
              }
            >
              <Routes>
                {/* 1. KHU VỰC NHÀ HÀNG (Được bảo vệ) */}
                {/* Khi vào đường dẫn bắt đầu bằng /restaurant/* thì check quyền trước */}
                <Route
                  element={
                    <RoleBasedRoute allowedRoles={["restaurant_manager"]} />
                  }
                >
                  <Route path="/restaurant/*" element={<RestaurantRoutes />} />
                </Route>

                {/* 2. KHU VỰC SHIPPER (Được bảo vệ) */}
                <Route element={<RoleBasedRoute allowedRoles={["driver", "shipper"]} />}>
                  <Route
                    path="/shipper/*"
                    element={
                      <ShipperRoutes />
                    }
                  />
                </Route>

                {/* 3. KHU VỰC KHÁCH HÀNG (Public) */}
                {/* Dấu * nghĩa là tất cả các đường dẫn còn lại sẽ do ClientRoutes xử lý */}
                <Route path="/*" element={<ClientRoutes />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
