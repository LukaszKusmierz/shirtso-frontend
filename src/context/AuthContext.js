import React, { createContext, useState, useEffect } from 'react';
import { login, register, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const user = await getCurrentUser();
                    setCurrentUser(user);
                }
            } catch (err) {
                console.error('Authentication initialization error:', err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const loginUser = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(credentials);
            localStorage.setItem('token', response.token);
            const user = await getCurrentUser();
            setCurrentUser(user);
            return user;
        } catch (err) {
            setError(err.message || 'Failed to login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await register(userData);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to register');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        error,
        login: loginUser,
        register: registerUser,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};