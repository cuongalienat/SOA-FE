import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import BackLink from "../../components/common/BackLink";
import "./styles.css";
import { ChefHat } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/signin");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/set-password");
  };

  return (
    <div className="forgotPassword-body">
      <main className="forgotPassword-container">
        <section className="forgotPassword-section">
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
          <BackLink text="Trở về đăng nhập" onClick={handleBackToLogin} />

          <h1 className="forgotPassword-title">Quên mật khẩu?</h1>
          <p className="forgotPassword-subtitle">
            Đừng lo lắng, nhập email bạn ở dưới để lấy lại mật khẩu.
          </p>

          <form className="forgotPassword-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
            <button type="submit" className="submit-btn">
              Xác nhận
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ForgotPassword;
