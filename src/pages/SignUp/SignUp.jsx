import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuths";
import { validateSignupData } from "../../utils/validationUtils.js";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import NotificationPopup from "../../components/common/NotificationPopup";
import "./styles.css";
import { ChefHat } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const handleLoginRedirect = () => {
    navigate("/signin");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, type = "info") => {
    setNotification({
      isVisible: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Kiểm tra mật khẩu xác nhận trước
    if (formData.password !== formData.confirmPassword) {
      showNotification("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    // Validate dữ liệu trước khi gọi API
    const validationErrors = validateSignupData({
      username: formData.username,
      fullName: formData.fullName,
      age: formData.age,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (validationErrors.length > 0) {
      showNotification(validationErrors.join(", "), "error");
      return;
    }

    // Hiển thị thông báo đang xử lý
    showNotification("Đang xử lý đăng ký...", "info");

    try {
      // Gọi API đăng ký (bỏ qua validation ở hook vì đã validate ở component)
      const result = await signup(
        {
          username: formData.username,
          fullName: formData.fullName,
          age: parseInt(formData.age),
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        true
      );

      if (result.success === true) {
        // Đăng ký thành công
        showNotification(result.data.message, "success");

        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          navigate("/verify-code", {
            state: {
              email: formData.email,
            },
          });
        }, 2000);
      } else {
        // Đăng ký thất bại - hiển thị lỗi từ API
        showNotification(result.error, "error");
      }
    } catch (err) {
      console.error("Signup error:", err);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="signup-body">
      <section className="form-column">
        <header className="form-header">
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
        </header>

        <div className="form-container">
          <h1 className="signup-title">Đăng ký</h1>
          <p className="signup-subtitle">
            Tạo tài khoản cá nhân để tận hưởng trọn vẹn mọi tiện ích.
          </p>

          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="form-row">
              <Input
                label="Tên đăng nhập"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Tên đăng nhập"
                required
              />
              <Input
                label="Họ và tên"
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Họ tên"
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Tuổi"
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="18"
                min="1"
                max="120"
                required
              />
              <Input
                label="Số điện thoại"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0123456789"
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              required
            />

            <PasswordInput
              label="Mật khẩu"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mật khẩu"
              required
            />

            <PasswordInput
              label="Xác nhận mật khẩu"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              required
            />

            <div className="terms-group">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="terms-checkbox"
                required
              />
              <label htmlFor="terms" className="terms-label">
                Tôi đồng ý với mọi{" "}
                <a href="#" className="terms-link">
                  Điều khoản
                </a>{" "}
                và{" "}
                <a href="#" className="terms-link">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="login-link">
            Đã có tài khoản?{" "}
            <span onClick={handleLoginRedirect}>Đăng nhập</span>
          </p>
        </div>
      </section>

      {/* Notification Popup */}
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        position={{ vertical: "top", horizontal: "right" }}
        autoClose={true}
        duration={4000}
      />
    </div>
  );
};

export default SignUp;
