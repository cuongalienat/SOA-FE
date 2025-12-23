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

// Tên sự kiện để các phiên bản useAuth nói chuyện với nhau
const AUTH_UPDATE_EVENT = "local-auth-update";

export const useAuth = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ------------------------------------------------------------------
  // 🚀 EFFECT 1: Lắng nghe tín hiệu thay đổi để đồng bộ ngay lập tức
  // ------------------------------------------------------------------
  useEffect(() => {
    const syncAuth = () => {
      setUser(getCurrentUser());
      setToken(getAuthToken());
    };

    // Lắng nghe khi tab khác thay đổi (Sự kiện chuẩn của trình duyệt)
    window.addEventListener("storage", syncAuth);
    // Lắng nghe khi cùng 1 tab thay đổi (Sự kiện tự chế của chúng ta)
    window.addEventListener(AUTH_UPDATE_EVENT, syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_UPDATE_EVENT, syncAuth);
    };
  }, []);

  // ------------------------------------------------------------------
  // 🛠️ HELPER: Hàm bắn tín hiệu cho các component khác cập nhật theo
  // ------------------------------------------------------------------
  const notifyAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_UPDATE_EVENT));
  };

  // ------------------------------------------------------------------
  // 📝 HÀM CẬP NHẬT USER (Cải tiến: Có sao lưu dự phòng theo ID)
  // ------------------------------------------------------------------
  const updateUser = (newUserFields) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...newUserFields };

      // 1. Lưu vào Key "user" (như ảnh bạn gửi) để hiển thị ngay
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 2. SAO LƯU DỰ PHÒNG: Để khi Logout/Login lại không bị mất tên
      if (updatedUser._id) {
        const persistentKey = `local_profile_${updatedUser._id}`;
        localStorage.setItem(
          persistentKey,
          JSON.stringify({
            name: updatedUser.name,
            avatar: updatedUser.avatar,
          })
        );
      }

      // 3. Cập nhật state nội bộ
      setUser(updatedUser);

      // 4. Bắn tín hiệu cho Navbar/Profile ở các trang khác cập nhật
      notifyAuthChange();

      console.log("✅ Đã cập nhật và phát tín hiệu đồng bộ");
    }
  };

  // ------------------------------------------------------------------
  // 🔑 HÀM ĐĂNG NHẬP (Cải tiến: Tự động nhặt lại tên dự phòng)
  // ------------------------------------------------------------------
  const signin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const validationErrors = validateSigninData({ username, password });
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "));
        return { success: false };
      }

      const data = await signInUser({ username, password });
      const tokenValue = data.accessToken || data.token;

      let userToSave = data.user;

      // KIỂM TRA KHO DỰ PHÒNG: Nếu trước đây đã từng đổi tên ở máy này
      const persistentKey = `local_profile_${userToSave._id}`;
      const savedLocal = localStorage.getItem(persistentKey);
      if (savedLocal) {
        const localData = JSON.parse(savedLocal);
        userToSave = { ...userToSave, ...localData }; // Gộp tên/ảnh cũ vào
      }

      saveAuthData({ token: tokenValue, user: userToSave });
      setUser(userToSave);
      setToken(tokenValue);
      notifyAuthChange(); // Báo cho các trang khác là đã đăng nhập

      return { success: true, data: data };
    } catch (err) {
      setError(err.message || "Sai username hoặc mật khẩu");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Tương tự cho Sign In Google
  const signInGoogle = async (googleToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signInWithGoogle(googleToken);
      let userToSave = data.user;

      const persistentKey = `local_profile_${userToSave._id}`;
      const savedLocal = localStorage.getItem(persistentKey);
      if (savedLocal) {
        userToSave = { ...userToSave, ...JSON.parse(savedLocal) };
      }

      saveAuthData({ token: data.accessToken || data.token, user: userToSave });
      setUser(userToSave);
      notifyAuthChange();
      return { success: true, data: data };
    } catch (err) {
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
      if (!skipValidation) {
        const validationErrors = validateSignupData(userData);
        if (validationErrors.length > 0) {
          setError(validationErrors.join(", "));
          return null;
        }
      }
      const data = await signUpUser(userData);
      const tokenValue = data.accessToken || data.token;
      if (tokenValue && data.user) {
        saveAuthData({ token: tokenValue, user: data.user });
        setUser(data.user);
        setToken(tokenValue);
        notifyAuthChange();
      }
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
    notifyAuthChange(); // Báo cho các trang khác là đã đăng xuất để ẩn profile
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
