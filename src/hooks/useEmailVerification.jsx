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
<<<<<<< HEAD

=======
    
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a
    try {
      await verifyEmail(email, otpCode);
      setSuccess(true);
      // Tự động đăng nhập sau khi hiển thị thông báo thành công
      setTimeout(() => {
        navigate("/signin", {
<<<<<<< HEAD
          state: {
            message: "Xác thực email thành công! Vui lòng đăng nhập.",
            type: "success",
          },
=======
          state: { 
            message: "Xác thực email thành công! Vui lòng đăng nhập.",
            type: "success"
          } 
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a
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
    setLoading(true);
    setError(null);
    setSuccess(false);
<<<<<<< HEAD

=======
    
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a
