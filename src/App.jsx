import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Navbar/Layout";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Deals from "./pages/Deals/Deals";
import FoodDetail from "./pages/FoodDetail/FoodDetail";
import Category from "./pages/Category/Category";
import Order from "./pages/Order/Order";
import Cart from "./pages/Cart/Cart";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import SetPassword from "./pages/SetPassword";
import VerifyCode from "./pages/VerifyCode";

export default function App() {
  return (
    <Routes>
      {/* Các trang có Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/food/:id" element={<FoodDetail />} /> {/* 👈 */}
        <Route path="/category/:type" element={<Category />} />
        <Route path="/order/:id" element={<Order />} /> {/* 👈 */}
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* Trang auth không có Layout */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />

      {/* Fallback */}
      <Route path="*" element={<h1>404 - Trang không tồn tại</h1>} />
    </Routes>
  );
}
