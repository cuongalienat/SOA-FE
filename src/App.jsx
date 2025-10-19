import { Routes, Route } from "react-router-dom"
import { SignIn } from "./components/signIn/signIn.jsx";
import { ForgotPassword } from "./components/forgotPassword/forgotPassword.jsx";
import { SetPassword } from "./components/setPassword/setPassword.jsx";
import { SignUp } from "./components/signUp/signUp.jsx";
import { VerifyCode } from "./components/verifyEmail/verifyEmail.jsx";

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
