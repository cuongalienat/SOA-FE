import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// 1. Import các Context
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext.jsx";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext.jsx";
// Giả định đường dẫn import cho 2 provider bị thiếu:
import { RestaurantProvider } from "./context/RestaurantContext"; 
import { ShipperProvider } from "./context/ShipperContext";

// 2. Import Components & Routes
import RoleBasedRoute from "./components/common/RoleBasedRoute";

const ClientRoutes = React.lazy(() => import("./routes/customerRoutes.jsx"));
const RestaurantRoutes = React.lazy(() => import("./routes/shopRoutes.jsx"));
const ShipperRoutes = React.lazy(() => import("./routes/shipperRoutes.jsx"));

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider> {/* Nên để Toast ở mức cao để hiện thông báo đè lên mọi thứ */}
          <CartProvider>
            <RestaurantProvider>
              <ShipperProvider>
                <HashRouter>
                  
                  <Suspense
                    fallback={
                      <div className="h-screen flex items-center justify-center">
                        Loading app...
                      </div>
                    }
                  >
                    <Routes>
                      {/* --- 1. KHU VỰC NHÀ HÀNG (Protected) --- */}
                      <Route element={<RoleBasedRoute allowedRoles={["restaurant_manager"]} />}>
                        <Route path="/restaurant/*" element={<RestaurantRoutes />} />
                      </Route>

                      {/* --- 2. KHU VỰC SHIPPER (Protected) --- */}
                      <Route element={<RoleBasedRoute allowedRoles={["driver", "shipper"]} />}>
                        <Route path="/shipper/*" element={<ShipperRoutes />} />
                      </Route>

                      {/* --- 3. KHU VỰC KHÁCH HÀNG (Public) --- */}
                      <Route path="/*" element={<ClientRoutes />} />
                      
                    </Routes>
                  </Suspense>

                </HashRouter>
              </ShipperProvider>
            </RestaurantProvider>
          </CartProvider>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;