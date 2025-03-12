import api from './api.js';

export const login = async (credentials) => {
    return api.post('/auth/login', credentials);
};

export const register = async (userData) => {
    return api.post('/auth/register', userData);
};

export const getCurrentUser = async () => {
    try {
        return await api.get('/auth/me');
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        localStorage.removeItem('token');
        return null;
    }
};