import { Routes, Route } from "react-router-dom"
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import SetPassword from "./pages/SetPassword";
import SignUp from "./pages/SignUp";
import VerifyCode from "./pages/VerifyCode";

function App() {

  return (
    <Routes>
      <Route path="/" element={<h1>Hello world</h1>} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-code" element={<VerifyCode />} />
    </Routes>
  )
}

export default App
