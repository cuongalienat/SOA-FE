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
  getAuthToken,
} from "../utils/authUtils.js";

const AUTH_UPDATE_EVENT = "local-auth-update";

export const useAuth = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Đồng bộ hóa giữa các Tab và các Component
  useEffect(() => {
    const syncAuth = () => {
      setUser(getCurrentUser());
      setToken(getAuthToken());
    };
    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_UPDATE_EVENT, syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_UPDATE_EVENT, syncAuth);
    };
  }, []);

  const notifyAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_UPDATE_EVENT));
  };

  // 2. Cập nhật thông tin User (Lưu local + dự phòng theo ID)
  const updateUser = (newUserFields) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...newUserFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (updatedUser._id) {
        const persistentKey = `local_profile_${updatedUser._id}`;
        localStorage.setItem(persistentKey, JSON.stringify({
          name: updatedUser.name,
          avatar: updatedUser.avatar,
        }));
      }
      setUser(updatedUser);
      notifyAuthChange();
    }
  };

  // 3. Đăng nhập (Kết hợp xử lý lỗi từ Main + Khôi phục Profile từ Shipper-stuff)
  const signin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const validationErrors = validateSigninData({ username, password });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      const data = await signInUser({ username, password });
      
      // Kiểm tra lỗi từ backend (logic từ nhánh main)
      if (data && (data.success === false || (data.code && data.code !== 200))) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      const tokenValue = data.accessToken || data.token || (data.data && (data.data.accessToken || data.data.token));
      let userValue = data.user || (data.data && data.data.user);

      if (!tokenValue) throw new Error("Không tìm thấy mã truy cập (token) từ server");

      // KHÔI PHỤC PROFILE LOCAL (logic từ nhánh shipper-stuff)
      if (userValue && userValue._id) {
        const savedLocal = localStorage.getItem(`local_profile_${userValue._id}`);
        if (savedLocal) {
          userValue = { ...userValue, ...JSON.parse(savedLocal) };
        }
      }

      saveAuthData({ token: tokenValue, user: userValue });
      setToken(tokenValue);
      setUser(userValue);
      notifyAuthChange();

      return { success: true, data: data };
    } catch (err) {
      const errorMessage = err.message || "Sai tài khoản hoặc mật khẩu";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 4. Đăng nhập Google (Đã gộp logic)
  const signInGoogle = async (googleToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signInWithGoogle(googleToken);
      const tokenValue = data.accessToken || data.token;
      let userValue = data.user;

      const savedLocal = localStorage.getItem(`local_profile_${userValue?._id}`);
      if (savedLocal) {
        userValue = { ...userValue, ...JSON.parse(savedLocal) };
      }

      saveAuthData({ token: tokenValue, user: userValue });
      setToken(tokenValue);
      setUser(userValue);
      notifyAuthChange();
      return { success: true, data: data };
    } catch (err) {
      setError(err.message || "Đăng nhập Google thất bại");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 5. Đăng ký (Đã gộp logic xử lý token mới/cũ)
  const signup = async (userData, skipValidation = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!skipValidation) {
        const validationErrors = validateSignupData(userData);
        if (validationErrors.length > 0) throw new Error(validationErrors.join(", "));
      }

      const data = await signUpUser(userData);
      const tokenValue = data.accessToken || data.token;
      const userValue = data.user;

      if (tokenValue && userValue) {
        saveAuthData({ token: tokenValue, user: userValue });
        setUser(userValue);
        setToken(tokenValue);
      } else {
        saveAuthData(data); // Fallback cho backend cũ
        if (data.user) setUser(data.user);
      }

      notifyAuthChange();
      return { success: true, data: data };
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setToken(null);
    setError(null);
    notifyAuthChange();
  };

  return {
    signin,
    signup,
    logout,
    updateUser,
    signInGoogle,
    loading,
    error,
    user,
    token,
  };
};