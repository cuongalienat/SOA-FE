import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    createWallet,
    getWallet,
    depositWallet,
    getHistory,
} from "../services/walletService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWallet = useCallback(async () => {
        if (!user) return; // Don't fetch if no user
        setLoading(true);
        setError(null);
        try {
            const data = await getWallet();
            // Assuming data structure based on previous useWallet code
            setWallet(data.data !== undefined ? data.data : data);
        } catch (err) {
            // Wallet might not exist yet
            console.warn("Wallet fetch failed or not found:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchTransactions = useCallback(async (page = 1, limit = 6) => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await getHistory(page, limit);
            const data = response.data || response;
            const txList = data.transactions || [];

            setTransactions(Array.isArray(txList) ? txList : []);
            setPagination({
                total: data.total || 0,
                totalPages: data.totalPages || 1,
                currentPage: Number(data.currentPage) || 1
            });
        } catch (err) {
            console.error("Lỗi tải lịch sử giao dịch:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch when user logs in or provider mounts
    useEffect(() => {
        if (user) {
            fetchWallet();
            fetchTransactions();
        } else {
            // Reset state on logout
            setWallet(null);
            setTransactions([]);
        }
    }, [user, fetchWallet, fetchTransactions]);

    const createMyWallet = useCallback(async (pin) => {
        if (!user?._id) {
            showToast("Không tìm thấy thông tin người dùng", "error");
            return { success: false, error: "User not found" };
        }
        setLoading(true);
        setError(null);
        try {
            console.log("Creating wallet for user:", user._id);
            const data = await createWallet(pin, user._id);
            setWallet(data.data || data);
            showToast("Tạo ví thành công!", "success");
            return { success: true, data };
        } catch (err) {
            const msg = err.message || "Tạo ví thất bại";
            setError(msg);
            showToast(msg, "error");
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [user, showToast]);

    const depositMoney = useCallback(async (amount) => {
        setLoading(true);
        setError(null);
        try {
            const data = await depositWallet(amount);
            // Updating wallet is critical here for synchronization
            setWallet(prev => {
                // If the backend returns the full wallet object, use it. 
                // Otherwise, optimistically update balance if appropriate, but safer to use server response.
                const newWalletData = data.data || data;
                return newWalletData;
            });
            showToast("Nạp tiền thành công!", "success");

            // Refresh transactions after deposit to show the new entry?
            fetchTransactions();

            return { success: true, data };
        } catch (err) {
            const msg = err.message || "Nạp tiền thất bại";
            setError(msg);
            showToast(msg, "error");
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [showToast, fetchTransactions]);

    const value = {
        wallet,
        transactions,
        loading,
        error,
        fetchWallet,
        fetchTransactions,
        createMyWallet,
        depositMoney,
        pagination
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

export default WalletProvider;
