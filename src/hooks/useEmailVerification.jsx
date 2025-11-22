import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyEmail,
  resendVerificationEmail,
} from "../services/authServices.jsx";

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();

  const verify = async (email, otpCode) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await verifyEmail(email, otpCode);
      setSuccess(true);
      // Tự động đăng nhập sau khi hiển thị thông báo thành công
      setTimeout(() => {
        navigate("/signin", {
          state: { 
            message: "Xác thực email thành công! Vui lòng đăng nhập.",
            type: "success"
          } 
        });
      }, 1500);
    } catch (err) {
      console.error("Lỗi xác thực email:", err);
      setError(err.message || "Mã OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    if (!email) {
      setError("Vui lòng nhập email");
      return { success: false, error: "Email là bắt buộc" };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await resendVerificationEmail(email);
      return { success: true };
    } catch (err) {
      console.error("Lỗi gửi lại mã OTP:", err);
      setError(err.message || "Có lỗi xảy ra khi gửi lại mã OTP");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    verify,
    resendVerification,
  };
};