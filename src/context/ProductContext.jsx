import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAllItemsServices } from "../services/itemServices.jsx";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0);

    // Cache duration in milliseconds (e.g., 5 minutes)
    const CACHE_DURATION = 5 * 60 * 1000;

    const loadProducts = async (force = false) => {
        const now = Date.now();

        // If cache is valid and not forced, return cached products
        if (!force && products.length > 0 && (now - lastFetched < CACHE_DURATION)) {
            return;
        }

        setLoading(true);
        try {
            // Default to fetching a large list for client-side filtering
            const response = await fetchAllItemsServices({ limit: 1000 });
            if (response && response.data) {
                setProducts(response.data); // Adjust structure based on API
                setLastFetched(now);
            } else if (Array.isArray(response)) {
                setProducts(response);
                setLastFetched(now);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProductContext.Provider value={{ products, loading, loadProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
};
