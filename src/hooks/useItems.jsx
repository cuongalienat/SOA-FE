import { useState } from "react";
import { fetchAllItems } from "../services/itemServices.jsx";

export const useItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadItems = async () => {
        setLoading(true);
        try {
            const response = await fetchAllItems(); // Gọi API

            if (response && response.data) {
                setItems(response.data);
            } else {
                setItems([]); // Fallback nếu không có data
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return { items, loadItems, loading };
};