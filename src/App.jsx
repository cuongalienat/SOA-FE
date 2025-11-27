import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import RestaurantLayout from "./components/layout/RestaurantLayout.jsx";
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

// Restaurant Pages
import Dashboard from "./pages/Restaurant/Dashboard.jsx";
import Menu from "./pages/Restaurant/Menu.jsx";
import Orders from "./pages/Restaurant/Orders.jsx";
import Settings from "./pages/Restaurant/Settings.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import { RestaurantProvider } from "./context/RestaurantContext.jsx";

const App = () => {
  return (
    <CartProvider>
      <RestaurantProvider>
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
              path="/verify-code"
              element={
                <Layout>
                  <VerifyCode />
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
          </Routes>
        </HashRouter>
      </RestaurantProvider>
    </CartProvider>
  );
};

export default App;
