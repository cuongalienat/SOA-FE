import { useState } from "react";
import { signInUser, signUpUser } from "../services/authServices.jsx";
<<<<<<< HEAD
import {
  validateSignupData,
  validateSigninData,
} from "../utils/validationUtils.js";
import { saveAuthData, clearAuthData } from "../utils/authUtils.js";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Kiểm tra username có tồn tại không (giả lập - thực tế cần gọi API)
  const checkUsernameExists = async (username) => {
    // Tạm thời return false, sau này có thể gọi API riêng để check
    // const response = await api.get(`/auths/check-username/${username}`);
    // return response.data.exists;
    return false;
  };

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

      console.log("✅ Đăng nhập thành công:", data); // <-- confirm login

      return data;
    } catch (err) {
      console.error("❌ Đăng nhập thất bại:", err);
      setError(err.message || "Sai username hoặc mật khẩu");
      return null;
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

        // Kiểm tra username có tồn tại không
        const usernameExists = await checkUsernameExists(userData.username);
        if (usernameExists) {
          setError("Username đã tồn tại. Vui lòng chọn username khác.");
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

      return data;
    } catch (err) {
      console.error("❌ Đăng ký thất bại:", err);
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
      return null;
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

  return { signin, signup, logout, loading, error, user };
=======
import { validateSignupData, validateSigninData } from "../utils/validationUtils.js";
import { saveAuthData, clearAuthData } from "../utils/authUtils.js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const signin = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            // Validate dữ liệu đăng nhập
            const validationErrors = validateSigninData({ username, password });
            if (validationErrors.length > 0) {
                setError(validationErrors.join(', '));
                return null;
            }

            const data = await signInUser({ username, password });

            // Lưu token & user sử dụng authUtils
            saveAuthData(data);
            if (data.user) {
                setUser(data.user);
            }

            console.log("✅ Đăng nhập thành công:", data); // <-- confirm login

            return { success: true, data: data };
        } catch (err) {
            console.error("❌ Đăng nhập thất bại:", err);
            setError(err.message || "Sai username hoặc mật khẩu");
            return { success: false, error: error.message };
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
                    setError(validationErrors.join(', '));
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

    return { signin, signup, logout, loading, error, user };
>>>>>>> 5f0339b404f1292619b3460a7f429de6683a4a1a
};
