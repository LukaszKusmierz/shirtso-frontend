import axiosInstance from "./axios";
import API_CONFIG from "../config/api.config";

/**
 * Authentication service
 * Handles user authentication, registration, and session management
 */
export const authService = {
    /**
     * Login user with credentials
     * @param {Object} credentials - The login credentials (username, password)
     * @returns {Promise<Object>} Login response with token
     */
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
            if (response.token) {
                localStorage.setItem(API_CONFIG.TOKEN_KEY, response.token);
            }
            return response;
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    },

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration response
     */
    register: async (userData) => {
        try {
            return await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
        } catch (error) {
            console.error("Registration failed:", error.message);
            throw error;
        }
    },

    /**
     * Logout current user by removing auth token
     */
    logout: () => {
        localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    isAuthenticated: () => {
        return localStorage.getItem(API_CONFIG.TOKEN_KEY) !== null;
    }
};
