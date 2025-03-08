import {createContext, useEffect, useState} from "react";
import {authService} from "../api/auth";
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const decoded = jwt_decode(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        authService.logout();
                        setCurrentUser(null);
                    }else {
                        setCurrentUser({
                            username: decoded.sub,
                            roles: decoded.roles || []
                        });
                    }
                } catch (error) {
                    console.error("Incorrect token", error);
                    authService.logout();
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            const data = await authService.login(credentials);

            if (data.token) {
                const decoded = jwt_decode(data.token);
                setCurrentUser({
                    username: decoded.sub,
                    roles: decoded.roles || []
                });
            }
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.info || 'Login failed');
            setLoading(false);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);
            await authService.register(userData);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.info || 'Registration failed');
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const hasRole = (role) => {
        return currentUser?.roles.includes(role) || false;
    };

    const contextValue = {
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
