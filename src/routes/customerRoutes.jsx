import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home/Home.jsx";
import FoodDetail from "../pages/FoodDetail/FoodDetail.jsx";
import ShopDetail from "../pages/ShopDetail/ShopDetail.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import Category from "../pages/Category/Category.jsx";
import Contact from "../pages/Contact/Contact.jsx";
import SignIn from "../pages/SignIn/SignIn.jsx";
import SignUp from "../pages/SignUp/SignUp.jsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.jsx";
import VerifyCode from "../pages/VerifyCode/VerifyCode.jsx";
import SetPassword from "../pages/SetPassword/SetPassword.jsx";
import UserProfile from "../pages/Profile/UserProfile.jsx";
import OrderDetail from "../pages/OrderDetail/OrderDetail.jsx";

const CustomerRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/food/:id" element={<FoodDetail />} />
                <Route path="/shop/:id" element={<ShopDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/category" element={<Category />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/verify-code" element={<VerifyCode />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/order/:id" element={<OrderDetail />} />
            </Routes>
        </Layout>
    );
};

export default CustomerRoutes;