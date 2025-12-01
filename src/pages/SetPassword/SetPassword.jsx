import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import PasswordInput from "../../components/common/PasswordInput";
import BackLink from "../../components/common/BackLink";
import "./styles.css";
import { ChefHat } from "lucide-react";

const SetPassword = () => {
  const navigate = useNavigate();

  const handleBackToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Password updated successfully!");
    navigate("/signin");
  };

  return (
    <div className="setPassword-body">
      <main className="setPassword-container">
        <section className="setPassword-section">
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
          <BackLink
            text="Nhập lại email"
            onClick={handleBackToForgotPassword}
          />

          <h1 className="setPassword-title">Đặt lại mật khẩu</h1>
          <p className="setPassword-subtitle">
            Mật khẩu của bạn đã được làm mới. Vui lòng nhập mật khẩu mới cho tài
            khoản của bạn.
          </p>

          <form className="setPassword-form" onSubmit={handleSubmit}>
            <PasswordInput
              label="Mật khẩu mới"
              id="create-password"
              name="create-password"
              defaultValue=""
              required
            />

            <PasswordInput
              label="Nhập lại mật khẩu"
              id="reenter-password"
              name="reenter-password"
              defaultValue=""
              required
            />

            <button type="submit" className="setPassword-btn">
              Xác nhận
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SetPassword;
