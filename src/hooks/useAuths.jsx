import { useState } from "react";
import { signInUser } from "../services/authServices.jsx";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await signInUser({ username, password });

            // Lưu token & user nếu có
            if (data.token) localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
            }

            console.log("✅ Đăng nhập thành công:", data); // <-- confirm login

            return data;
        } catch (err) {
            console.error("❌ Đăng nhập thất bại:", err);
            setError(err.message || "Sai username hoặc mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error, user };
};
