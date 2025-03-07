import axiosInstance from "./axios";
import API_CONFIG from "../config/api.config";

/**
 * Product service
 * Handles fetching and managing product data
 */
export const productService = {
    /**
     * Get all products with pagination
     * @param {number} page - Page number (defaults to 0)
     * @param {number} size - Page size (defaults to 10)
     * @returns {Promise<Object>} Paginated products
     */
    getAllProducts: async (page = 0, size = 10) => {
        try {
            return await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?page=${page}&size=${size}`);
        } catch (error) {
            console.error("Failed to fetch products:", error.message);
            throw error;
        }
    },

    /**
     * Get products by subcategory
     * @param {number} subcategoryId - The subcategory ID
     * @returns {Promise<Array>} Products in the subcategory
     */
    getProductsByCategory: async (subcategoryId) => {
        try {
            return await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?subcategoryId=${subcategoryId}`);
        } catch (error) {
            console.error(`Failed to fetch products for subcategory ${subcategoryId}:`, error.message);
            throw error;
        }
    },

    /**
     * Get products by size
     * @param {string} size - The product size
     * @returns {Promise<Array>} Products of specified size
     */
    getProductsBySize: async (size) => {
        try {
            return await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?size=${size}`);
        } catch (error) {
            console.error(`Failed to fetch products for size ${size}:`, error.message);
            throw error;
        }
    },

    /**
     * Get products by name
     * @param {string} productName - The product name to search for
     * @returns {Promise<Array>} Matching products
     */
    getProductsByName: async (productName) => {
        try {
            return await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}?productName=${productName}`);
        } catch (error) {
            console.error(`Failed to fetch products with name ${productName}:`, error.message);
            throw error;
        }
    },

    /**
     * Get products that are in stock
     * @returns {Promise<Array>} In-stock products
     */
    getProductsInStock: async () => {
        try {
            return await axiosInstance.get(API_CONFIG.ENDPOINTS.PRODUCTS.IN_STOCK);
        } catch (error) {
            console.error("Failed to fetch in-stock products:", error.message);
            throw error;
        }
    },

    /**
     * Get products that are out of stock
     * @returns {Promise<Array>} Out-of-stock products
     */
    getProductsNotInStock: async () => {
        try {
            return await axiosInstance.get(API_CONFIG.ENDPOINTS.PRODUCTS.NOT_IN_STOCK);
        } catch (error) {
            console.error("Failed to fetch out-of-stock products:", error.message);
            throw error;
        }
    },

    /**
     * Get products with low stock (need top-up)
     * @returns {Promise<Array>} Products with low stock
     */
    getProductsTopUpStock: async () => {
        try {
            return await axiosInstance.get(API_CONFIG.ENDPOINTS.PRODUCTS.TOP_UP_STOCK);
        } catch (error) {
            console.error("Failed to fetch low-stock products:", error.message);
            throw error;
        }
    },

    /**
     * Add a new product
     * @param {Object} productData - The product data
     * @returns {Promise<Object>} The created product
     */
    addProduct: async (productData) => {
        try {
            return await axiosInstance.post(API_CONFIG.ENDPOINTS.PRODUCTS.BASE, productData);
        } catch (error) {
            console.error("Failed to add product:", error.message);
            throw error;
        }
    }
};
