import api from './Api.jsx';

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

export const forgotPassword = async (email) => {
    return api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
};

export const validateResetToken = async (token) => {
    return api.get(`/auth/validate-token/${token}`);
};

export const logout = async () => {
    return api.post('/auth/logout');
};
//TODO: podepnij logout do backend'u