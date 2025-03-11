import api from './api.js';

export const login = async (credentials) => {
    return api.post('/auth/login', credentials);
};

export const register = async (userData) => {
    return api.post('/auth/register', userData);
};

// This is a placeholder - your backend doesn't have a current user endpoint
// You'd typically decode the JWT or add an endpoint to fetch user details
export const getCurrentUser = async () => {
    // In a real app, you'd make an API call to get the current user's details
    // For now, we'll just return a placeholder user based on the token
    const token = localStorage.getItem('token');
    if (!token) return null;

    // This is a simplified approach. In a real app, you might want to
    // decode the JWT token or make an API call to get the user data
    return {
        username: 'User',
        roles: ['USER_READ']
    };
};