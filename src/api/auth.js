import axios from "axios";

export const authService = {
    login: async (credentials) => {
        const response = await axios.post(`/auth/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('auth-token', response.data.token);
        }
        return response.data;
    },

    register: async (userData) => {
        return await axios.post(`/auth/register`, userData);
    },

    logout: () => {
        localStorage.removeItem('auth-token');
    },

    isAuthenticated: () => {
        return localStorage.getItem('auth-token') !== null;
    }
};
