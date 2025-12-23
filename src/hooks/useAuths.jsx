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
  const [token, setToken] = useState(null);


  // Persistence: Load user from local storage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = getAuthToken();
    if (storedUser) {
      if (storedUser.balance === undefined) {
        storedUser.balance = 0;
      }
      setUser(storedUser);
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const signin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      // Validate dữ liệu đăng nhập
      // const validationErrors = validateSigninData({ username, password });
      // if (validationErrors.length > 0) {
      //   const errorMsg = validationErrors.join(", ");
      //   setError(errorMsg);
      //   return { success: false, error: errorMsg };
      // }

      console.log("Starting signin for:", username);
      const data = await signInUser({ username, password });
      console.log("API Response:", data);

      // Handle generic 200 OK with error payload checking
      // Some backends return 200 OK but with success: false
      if (data && (data.success === false || (data.code && data.code !== 200))) {
        console.error("API returned error status despite 200 OK headers");
        throw new Error(data.message || data.error || "Đăng nhập thất bại");
      }

      // Try to find the token in likely places
      const tokenValue = data.accessToken || data.token || (data.data && (data.data.accessToken || data.data.token));
      console.log("Extracted Token:", tokenValue ? "Token found" : "No token found");

      if (!tokenValue || typeof tokenValue !== 'string') {
        console.error("Invalid or missing token in response");
        throw new Error(data.message || "Không tìm thấy token hợp lệ trong phản hồi từ server");
      }

      const userValue = data.user || (data.data && data.data.user);

      const authDataToSave = {
        token: tokenValue,
        user: userValue
      };

      saveAuthData(authDataToSave);
      setToken(tokenValue);
      if (userValue) {
        setUser(userValue);
      }

      console.log("Signin successful. User:", userValue);

      // Return a consistent structure
      return { success: true, data: { ...data, user: userValue, token: tokenValue } };
    } catch (err) {
      console.error("Signin Exception:", err);
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

      const tokenValue = data.accessToken || data.token;
      const authDataToSave = {
        token: tokenValue,
        user: data.user
      };

      saveAuthData(authDataToSave);
      if (data.user) {
        setUser(data.user);
      }
      console.log("✅ Đăng nhập Google thành công:");
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
    token
  };
};
