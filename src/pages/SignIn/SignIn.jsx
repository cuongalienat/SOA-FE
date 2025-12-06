import React, { useState } from "react";
import Separator from "../../components/common/Separator";
import GoogleSignIn from "../../components/common/GoogleSignIn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEmailVerification } from "../../hooks/useEmailVerification";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import NotificationPopup from "../../components/common/NotificationPopup";

import { ChefHat } from "lucide-react";
import "./styles.css";

const SignIn = () => {
  const navigate = useNavigate();
  const { signin, signInGoogle, loading, error } = useAuth();


  const { resendVerification } = useEmailVerification();
  const [username, setUsername] = useState("john.doe@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };
  const showNotification = (message, type = "info") => {
    setNotification({
      isVisible: true,
      message,
      type,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signin(username, password);

    if (result.success === true && result.data?.user?.isVerified === "no") {
      const emailToVerify = result?.data?.user?.email || username;
      showNotification(
        "Tài khoản chưa được xác thực. Đang gửi lại mã xác thực...",
        "warning"
      );
      resendVerification(emailToVerify);
      setTimeout(() => {
        navigate("/verify-code", {
          state: {
            email: emailToVerify,
          },
        });
      }, 1200);
      return;
    }

    if (result.success === true) {
      // Đăng nhập thành công
      const role = result.data.user.role;
      showNotification(result.data.message, "success");

      switch (role) {
        case "restaurant_manager":
          navigate("/restaurant", { replace: true });
          break;
        case "shipper":
          navigate("/shipper", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } else {
      // Đăng nhập thất bại
      showNotification(result.error, "error");
    }
  };

  const handleGoogleSignIn = async (tokenId) => {
    const result = await signInGoogle(tokenId);
    if (result.success === true) {
      showNotification("Đăng nhập Google thành công!", "success");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      showNotification(result.error, "error");
    }
  };

  return (
    <div className="signIn-body">
      <main className="signIn-container">
        <section className="signIn-section">
          <div className="flex items-center gap-2 mb-6 justify-center">
            {/* Phần Icon */}
            <div className="bg-orange-500 p-1.5 rounded-lg flex items-center justify-center">
              <ChefHat className="text-white h-6 w-6" />
            </div>

            {/* Phần Chữ */}
            <span className="font-bold text-xl tracking-tight text-gray-800">
              Món<span className="text-orange-500">Việt</span>
            </span>
          </div>
          <h1 className="signIn-title">Sign in</h1>
          <p className="signIn-subtitle">Đăng nhập vào tài khoản Món Việt</p>

          <form className="signIn-form" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              id="username"
              name="username"
              placeholder="Tên đăng nhập"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <PasswordInput
              label="Password"
              id="password"
              name="password"
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="form-options">
              <span
                onClick={handleForgotPassword}
                className="forgot-password-link"
              >
                Forgot Password
              </span>
            </div>

            <button
              type="submit"
              className="bg-orange-500 signIn-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "... Đang đăng nhập" : "Đăng nhập"}
            </button>

            <Separator text="Hoặc đăng nhập với" />
            <GoogleSignIn onClick={handleGoogleSignIn} />
          </form>

          <p className="signup-link">
            Chưa có tài khoản?{" "}
            <span onClick={handleSignUpRedirect}>Đăng ký</span>
          </p>
        </section>
      </main>

      {/* Notification Popup */}
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
        position={{ vertical: "top", horizontal: "right" }}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
};

export default SignIn;
