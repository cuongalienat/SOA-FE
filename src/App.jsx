import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastProvider } from "./context/ToastContext";
import { WalletProvider } from "./context/WalletContext";
import { CartProvider } from "./context/CartContext";
import { ShipperProvider } from "./context/ShipperContext";

import RoleBasedRoute from "./components/common/RoleBasedRoute";

// Lazy load routes
const ClientRoutes = React.lazy(() => import("./routes/customerRoutes.jsx"));
const RestaurantRoutes = React.lazy(() => import("./routes/shopRoutes.jsx"));
const ShipperRoutes = React.lazy(() => import("./routes/shipperRoutes.jsx"));

import { ProductProvider } from "./context/ProductContext";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <WalletProvider>
            <ProductProvider>
              <CartProvider>
                <HashRouter>
                  <Suspense
                    fallback={
                      <div className="h-screen flex items-center justify-center">
                        Loading app...
                      </div>
                    }
                  >
                    <Routes>
                      {/* ================= RESTAURANT (Protected) ================= */}
                      <Route
                        element={
                          <RoleBasedRoute allowedRoles={["restaurant_manager"]} />
                        }
                      >
                        <Route
                          path="/restaurant/*"
                          element={<RestaurantRoutes />}
                        />
                      </Route>

                      {/* ================= SHIPPER (Protected) ================= */}
                      <Route
                        element={
                          <RoleBasedRoute allowedRoles={["driver", "shipper"]} />
                        }
                      >
                        <Route
                          path="/shipper/*"
                          element={
                            <ShipperProvider>
                              <ShipperRoutes />
                            </ShipperProvider>
                          }
                        />
                      </Route>

                      {/* ================= CUSTOMER (Public) ================= */}
                      <Route path="/*" element={<ClientRoutes />} />
                    </Routes>
                  </Suspense>
                </HashRouter>
              </CartProvider>
            </ProductProvider>
          </WalletProvider>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
