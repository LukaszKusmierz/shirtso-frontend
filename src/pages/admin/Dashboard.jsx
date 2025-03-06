import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import OrderManagement from './OrderManagement';
import AdminOverview from './AdminOverview';

const AdminDashboard = () => {
    const { currentUser, hasRole, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Check if user has admin permissions
    if (!hasRole('ROLE_USER_WRITE')) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access the admin dashboard.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Return to Homepage
                </button>
            </div>
        );
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="mr-4 md:hidden text-gray-600 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">SHIRTSO Admin Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center">
                                <span className="text-sm text-gray-700 mr-2">Welcome, {currentUser?.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row">
                    {/* Sidebar Navigation */}
                    <div className={`md:w-64 md:block md:relative ${isSidebarOpen ? 'block fixed inset-0 z-20 bg-white' : 'hidden'}`}>
                        {isSidebarOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar}></div>
                        )}

                        <div className={`bg-white p-4 rounded-lg shadow md:shadow-none ${isSidebarOpen ? 'relative z-30 h-full' : ''}`}>
                            {isSidebarOpen && (
                                <button
                                    onClick={toggleSidebar}
                                    className="absolute top-4 right-4 md:hidden text-gray-600 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <nav className="mt-6">
                                <Link
                                    to="/admin"
                                    className={`block py-2.5 px-4 rounded transition ${
                                        isActiveRoute('/admin') && !isActiveRoute('/admin/products') && !isActiveRoute('/admin/categories') && !isActiveRoute('/admin/orders')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    Dashboard Overview
                                </Link>
                                <Link
                                    to="/admin/products"
                                    className={`block py-2.5 px-4 rounded transition ${
                                        isActiveRoute('/admin/products')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    Product Management
                                </Link>
                                <Link
                                    to="/admin/categories"
                                    className={`block py-2.5 px-4 rounded transition ${
                                        isActiveRoute('/admin/categories')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    Category Management
                                </Link>
                                <Link
                                    to="/admin/orders"
                                    className={`block py-2.5 px-4 rounded transition ${
                                        isActiveRoute('/admin/orders')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    Order Management
                                </Link>
                                <div className="border-t border-gray-200 my-4"></div>
                                <Link
                                    to="/"
                                    className="block py-2.5 px-4 rounded text-gray-700 hover:bg-gray-50 transition"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    Back to Shop
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:flex-1 mt-6 md:mt-0 md:ml-8">
                        <Routes>
                            <Route path="/" element={<AdminOverview />} />
                            <Route path="/products/*" element={<ProductManagement />} />
                            <Route path="/categories/*" element={<CategoryManagement />} />
                            <Route path="/orders/*" element={<OrderManagement />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
