import { useState, useCallback } from "react";
import {
    getUserInfoService,
    updateUserService,
    deleteUserService,
} from "../services/userServices";
import { useAuth } from "./useAuths";
import { saveAuthData } from "../utils/authUtils";

export const useUser = () => {
    const { user, logout } = useAuth(); // get current user context
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch latest user data
    const fetchUser = useCallback(async () => {
        if (!user?.username) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getUserInfoService(user.username);
            // Optional: Update local storage/context with fresh data if needed
            // But usually we just return data to the component
            return data;
        } catch (err) {
            setError(err.message || "Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    }, [user?.username]);

    const updateUser = async (updateData) => {
        if (!user?.username) {
            setError("No user logged in or missing username");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await updateUserService(user.username, updateData);

            // Update local storage so useAuth picks it up on reload or if we manually update state
            // Note: useAuth might need a way to set User state globally if we want immediate UI reflection 
            // without reload. For now, we update localStorage.
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...currentUser, ...data.user };
            saveAuthData({ user: updatedUser, token: localStorage.getItem("token") });

            // Ideally hook should return the updated user to update local state in UI
            return data;
        } catch (err) {
            setError(err.message || "Failed to update user");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async () => {
        if (!user?.username) return;
        setLoading(true);
        setError(null);
        try {
            await deleteUserService(user.username);
            logout(); // Logout after deletion
            return true;
        } catch (err) {
            setError(err.message || "Failed to delete user");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Simulated Wallet Top-up (since no endpoint provided in context yet, logic moved from useAuth)
    const topUpWallet = async (amount) => {
        // If there IS a service, call it here.
        // For now, replicating previous local logic but persisting to storage
        // In a real app, this should be an API call
        if (!user) return;

        // Simulate API delay
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));

        const newBalance = (user.balance || 0) + Number(amount);
        const updatedUser = { ...user, balance: newBalance };

        saveAuthData({ user: updatedUser, token: localStorage.getItem("token") });
        setLoading(false);
        return newBalance;
    };

    return {
        loading,
        error,
        fetchUser,
        updateUser,
        deleteUser,
        topUpWallet
    };
};
