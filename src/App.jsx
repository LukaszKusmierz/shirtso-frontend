import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from "./hooks/UseAuth";
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminGroupedProductImagePage from './pages/admin/AdminGroupedProductImagePage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
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
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <UserProfilePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/checkout" element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/checkout/payment/:orderId" element={
                            <ProtectedRoute>
                                <PaymentPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/orders" element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/orders/:orderId" element={
                            <ProtectedRoute>
                                <OrderDetailPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/products" element={
                            <AdminRoute>
                                <AdminProductsPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/products/edit/:id" element={
                            <AdminRoute>
                                <AdminProductEditPage />
                            </AdminRoute>
                        } />
                        <Route path="/admin/products/:id/images" element={
                            <AdminRoute>
                                <AdminGroupedProductImagePage />
                            </AdminRoute>
                        } />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </MainLayout>
            </AuthProvider>
        </Router>
    );
};

export default App;
