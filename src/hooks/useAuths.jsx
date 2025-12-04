import { useState, useEffect } from "react";
import {
  signInUser,
  signUpUser,
  signInWithGoogle,
} from "../services/authServices.jsx";
import {
  validateSignupData,
  validateSigninData,
} from "../utils/validationUtils.js";
import {
  saveAuthData,
  clearAuthData,
  getCurrentUser,
} from "../utils/authUtils.js";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    return getCurrentUser(); // Hàm này lấy từ localStorage
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistence: Load user from local storage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      if (storedUser.balance === undefined) {
        storedUser.balance = 0;
      }
      setUser(storedUser);
    }
  }, []);

  const signin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      // Validate dữ liệu đăng nhập
      const validationErrors = validateSigninData({ username, password });
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "));
        return null;
      }

      const data = await signInUser({ username, password });

      // Lưu token & user sử dụng authUtils
      saveAuthData(data);
      if (data.user) {
        setUser(data.user);
      }

      console.log("✅ Đăng nhập thành công:"); // <-- confirm login

      return { success: true, data: data };
    } catch (err) {
      console.error("❌ Đăng nhập thất bại:", err);
      setError(err.message || "Sai username hoặc mật khẩu");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async (googleToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signInWithGoogle(googleToken);
      if (data.user && data.user.balance === undefined) {
        data.user.balance = 80000;
      }
      saveAuthData(data);
      if (data.user) {
        setUser(data.user);
      }
      console.log("✅ Đăng nhập Google thành công", data);
      return { success: true, data: data };
    } catch (err) {
      console.error("❌ Đăng nhập Google thất bại:", err);
      setError(err.message || "Đăng nhập Google thất bại");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData, skipValidation = false) => {
    setLoading(true);
    setError(null);

    try {
      // Chỉ validate nếu không bỏ qua
      if (!skipValidation) {
        const validationErrors = validateSignupData(userData);
        if (validationErrors.length > 0) {
          setError(validationErrors.join(", "));
          return null;
        }
      }

      // Gọi API đăng ký
      const data = await signUpUser(userData);

      // Lưu token & user sử dụng authUtils (nếu backend trả về)
      saveAuthData(data);
      if (data.user) {
        setUser(data.user);
      }

      console.log("✅ Đăng ký thành công:", data);

      return { success: true, data: data };
    } catch (err) {
      console.error("❌ Đăng ký thất bại:", err);
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Hàm logout
  const logout = () => {
    clearAuthData();
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedData) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    saveAuthData({ user: newUser });
    return newUser;
  };

  const topUpWallet = (amount) => {
    if (!user) return;
    const newBalance = (user.balance || 0) + Number(amount);
    const newUser = { ...user, balance: newBalance };
    setUser(newUser);
    saveAuthData({ user: newUser });
    return newBalance;
  };

  return {
    signin,
    signup,
    logout,
    signInGoogle,
    updateUser,
    topUpWallet,
    loading,
    error,
    user,
  };
};
