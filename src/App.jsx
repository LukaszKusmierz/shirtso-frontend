import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from "./hooks/useAuth";
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductImagePage from './pages/admin/AdminProductImagePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component for normal user authentication
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/login" replace />;
};

// Protected route specifically for admin users
const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Check if user is logged in and has admin role
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = currentUser.roles && currentUser.roles.includes('USER_WRITE');

    return isAdmin ? children : <Navigate to="/" replace />;
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <MainLayout>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />

                        {/* Protected user routes */}
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <UserProfilePage />
                            </ProtectedRoute>
                        } />

                        {/* Protected admin routes */}
                        <Route path="/admin/products" element={
                            <AdminRoute>
                                <AdminProductsPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/products/images/:id" element={
                            <AdminRoute>
                                <AdminProductImagePage />
                            </AdminRoute>
                        } />

                        {/* 404 route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </MainLayout>
            </AuthProvider>
        </Router>
    );
};

export default App;

