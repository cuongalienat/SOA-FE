import { useState, useCallback } from "react";
import {
    fetchCategoriesByShopService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
    getCategoryByIdService,
    getCategoriesByShopService,
} from "../services/categoryServices";
import { useToast } from "../context/ToastContext";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showToast } = useToast();
    const [category, setCategory] = useState(null);
    const [categoriesByShop, setCategoriesByShop] = useState([]);

    const getCategoryById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategoryByIdService(id);
            setCategory(data.data);
        } catch (err) {
            setError(err);
            showToast(err.message || "Không thể tải danh mục", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchCategories = useCallback(async (shopId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategoriesByShopService(shopId);
            // Adjust based on API response structure. Usually data.data or data itself.
            setCategories(data.data || data);
        } catch (err) {
            setError(err);
            showToast(err.message || "Không thể tải danh mục", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchCategoriesByShop = useCallback(async (shopId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategoriesByShopService(shopId);
            // Adjust based on API response structure. Usually data.data or data itself.
            setCategoriesByShop(data.data || data);
        } catch (err) {
            setError(err);
            showToast(err.message || "Không thể tải danh mục", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const createCategory = async (categoryData) => {
        setLoading(true);
        try {
            const response = await createCategoryService(categoryData);
            setCategories((prev) => [...prev, response.data || response]);
            showToast("Tạo danh mục thành công", "success");
            return response;
        } catch (err) {
            showToast(err.message || "Không thể tạo danh mục", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (id, categoryData) => {
        setLoading(true);
        try {
            const response = await updateCategoryService(id, categoryData);
            const updatedCategory = response.data || response;

            setCategories((prev) =>
                prev.map((cat) => (cat._id === id || cat.id === id ? updatedCategory : cat))
            );
            showToast("Cập nhật danh mục thành công", "success");
            return response;
        } catch (err) {
            showToast(err.message || "Không thể cập nhật danh mục", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        setLoading(true);
        try {
            await deleteCategoryService(id);
            setCategories((prev) => prev.filter((cat) => (cat._id || cat.id) !== id));
            showToast("Xóa danh mục thành công", "success");
        } catch (err) {
            showToast(err.message || "Không thể xóa danh mục", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        categories,
        loading,
        error,
        category,
        categoriesByShop,
        getCategoryById,
        fetchCategories,
        fetchCategoriesByShop,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};