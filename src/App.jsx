import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import RestaurantLayout from "./components/layout/RestaurantLayout.jsx";
import ShipperLayout from "./components/layout/ShipperLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import FoodDetail from "./pages/FoodDetail/FoodDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Order from "./pages/Order/Order.jsx";
import Deals from "./pages/Deals/Deals.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import SignIn from "./pages/SignIn/SignIn.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import VerifyCode from "./pages/VerifyCode/VerifyCode.jsx";
import SetPassword from "./pages/SetPassword/SetPassword.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";

// Restaurant Pages
import Dashboard from "./pages/Restaurant/Dashboard.jsx";
import Menu from "./pages/Restaurant/Menu.jsx";
import Orders from "./pages/Restaurant/Orders.jsx";
import Settings from "./pages/Restaurant/Settings.jsx";

// Shipper Pages
import ShipperDashboard from "./pages/Shipper/Dashboard.jsx";
import ShipperOrderDetail from "./pages/Shipper/OrderDetail.jsx";
import ShipperHistory from "./pages/Shipper/History.jsx";
import ShipperProfile from "./pages/Shipper/Profile.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import { RestaurantProvider } from "./context/RestaurantContext.jsx";
import { ShipperProvider } from "./context/ShipperContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <RestaurantProvider>
            <ShipperProvider>
              <HashRouter>
                <Routes>
                  {/* Client Routes */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Home />
                      </Layout>
                    }
                  />
                  <Route
                    path="/food/:id"
                    element={
                      <Layout>
                        <FoodDetail />
                      </Layout>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <Layout>
                        <Cart />
                      </Layout>
                    }
                  />
                  <Route
                    path="/order"
                    element={
                      <Layout>
                        <Order />
                      </Layout>
                    }
                  />
                  <Route
                    path="/deals"
                    element={
                      <Layout>
                        <Deals />
                      </Layout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Layout>
                        <Contact />
                      </Layout>
                    }
                  />
                  <Route
                    path="/signin"
                    element={
                      <Layout>
                        <SignIn />
                      </Layout>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <Layout>
                        <SignUp />
                      </Layout>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <Layout>
                        <ForgotPassword />
                      </Layout>
                    }
                  />
                  <Route
                    path="/set-password"
                    element={
                      <Layout>
                        <SetPassword />
                      </Layout>
                    }
                  />
                  <Route
                    path="/verify-code"
                    element={
                      <Layout>
                        <VerifyCode />
                      </Layout>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Layout>
                        <UserProfile />
                      </Layout>
                    }
                  />

                  {/* Restaurant/Admin Routes */}
                  <Route
                    path="/restaurant"
                    element={
                      <RestaurantLayout>
                        <Dashboard />
                      </RestaurantLayout>
                    }
                  />
                  <Route
                    path="/restaurant/dashboard"
                    element={
                      <RestaurantLayout>
                        <Dashboard />
                      </RestaurantLayout>
                    }
                  />
                  <Route
                    path="/restaurant/menu"
                    element={
                      <RestaurantLayout>
                        <Menu />
                      </RestaurantLayout>
                    }
                  />
                  <Route
                    path="/restaurant/orders"
                    element={
                      <RestaurantLayout>
                        <Orders />
                      </RestaurantLayout>
                    }
                  />
                  <Route
                    path="/restaurant/settings"
                    element={
                      <RestaurantLayout>
                        <Settings />
                      </RestaurantLayout>
                    }
                  />

                  {/* Shipper/Driver Routes */}
                  <Route
                    path="/shipper"
                    element={
                      <ShipperLayout>
                        <ShipperDashboard />
                      </ShipperLayout>
                    }
                  />
                  <Route
                    path="/shipper/dashboard"
                    element={
                      <ShipperLayout>
                        <ShipperDashboard />
                      </ShipperLayout>
                    }
                  />
                  <Route
                    path="/shipper/order/:id"
                    element={
                      <ShipperLayout>
                        <ShipperOrderDetail />
                      </ShipperLayout>
                    }
                  />
                  <Route
                    path="/shipper/history"
                    element={
                      <ShipperLayout>
                        <ShipperHistory />
                      </ShipperLayout>
                    }
                  />
                  <Route
                    path="/shipper/profile"
                    element={
                      <ShipperLayout>
                        <ShipperProfile />
                      </ShipperLayout>
                    }
                  />
                </Routes>
              </HashRouter>
            </ShipperProvider>
          </RestaurantProvider>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
