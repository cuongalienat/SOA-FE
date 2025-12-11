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
  getAuthToken
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
        const errorMsg = validationErrors.join(", ");
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const data = await signInUser({ username, password });
      saveAuthData(data);
      if (data.user) {
        setUser(data.user);
      }

      console.log(" Đăng nhập thành công:"); // <-- confirm login

      return { success: true, data: data };
    } catch (err) {
      console.error(" Đăng nhập thất bại:", err);
      const errorMessage = err.message || "Sai username hoặc mật khẩu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
      console.log(" Đăng nhập Google thành công", data);
      return { success: true, data: data };
    } catch (err) {
      console.error(" Đăng nhập Google thất bại:", err);
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

      const tokenValue = data.accessToken || data.token;
      if (tokenValue && data.user) {
        const authDataToSave = {
          token: tokenValue,
          user: data.user
        };
        saveAuthData(authDataToSave);
        setUser(data.user);
        setToken(tokenValue);
      } else {
        // Nếu backend cũ (không trả token khi signup) thì giữ nguyên logic cũ
        saveAuthData(data);
        if (data.user) setUser(data.user);
      }

      console.log(" Đăng ký thành công:", data);

      return { success: true, data: data };
    } catch (err) {
      console.error(" Đăng ký thất bại:", err);
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
    setToken(null);
    setError(null);
  };

  return {
    signin,
    signup,
    logout,
    signInGoogle,
    loading,
    error,
    user,
  };
};
