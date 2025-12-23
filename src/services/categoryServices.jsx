import api from "../config/config";
import ENDPOINTS from "../config/endpoints";

export const fetchCategoriesByShopService = async (shopId) => {
  try {
    const response = await api.get(ENDPOINTS.CATEGORY.GET_ALL, {
      params: { shopId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy danh mục" };
  }
};

export const createCategoryService = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.CATEGORY.CREATE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi tạo danh mục" };
  }
};

export const updateCategoryService = async (id, data) => {
  try {
    const response = await api.put(
      ENDPOINTS.CATEGORY.UPDATE.replace(":id", id),
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi cập nhật danh mục" };
  }
};

export const deleteCategoryService = async (id) => {
  try {
    const response = await api.delete(
      ENDPOINTS.CATEGORY.DELETE.replace(":id", id)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi xóa danh mục" };
  }
};

export const getCategoryByIdService = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.CATEGORY.GET_BY_ID.replace(":id", id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi lấy danh mục" };
  }
};