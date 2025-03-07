import axiosInstance from "./axios";
import API_CONFIG from "../config/api.config";

/**
 * Category service
 * Handles fetching categories and subcategories
 */
export const categoryService = {
    /**
     * Get all categories
     * @returns {Promise<Array>} List of categories
     */
    getAllCategories: async () => {
        try {
            return await axiosInstance.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE);
        } catch (error) {
            console.error("Failed to fetch categories:", error.message);
            throw error;
        }
    },

    /**
     * Get all categories with their subcategories
     * @returns {Promise<Array>} List of categories with subcategories
     */
    getCategoriesWithSubcategories: async () => {
        try {
            return await axiosInstance.get(API_CONFIG.ENDPOINTS.CATEGORIES.WITH_SUBCATEGORIES);
        } catch (error) {
            console.error("Failed to fetch categories with subcategories:", error.message);
            throw error;
        }
    },

    /**
     * Get subcategories for a specific category
     * @param {number} categoryId - The category ID
     * @returns {Promise<Array>} List of subcategories
     */
    getSubcategoriesByCategory: async (categoryId) => {
        try {
            return await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SUBCATEGORIES.BASE}/${categoryId}`);
        } catch (error) {
            console.error(`Failed to fetch subcategories for category ${categoryId}:`, error.message);
            throw error;
        }
    }
};
