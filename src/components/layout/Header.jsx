import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import CartIcon from '../cart/CartIcon';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsUserMenuOpen(false);
    };
    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('USER_WRITE');

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        Shirtso
                    </Link>

                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-blue-600">
                            Products
                        </Link>

                        {currentUser && (
                            <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                                Orders
                            </Link>
                        )}

                        {currentUser ? (
                            <div className="flex items-center space-x-4">
                                <CartIcon />

                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
                                    >
                                        <span className="mr-1">Hello, {currentUser.userName}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Your Profile
                                            </Link>

                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Your Orders
                                            </Link>

                                            {isAdmin && (
                                                <Link
                                                    to="/admin/products"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        {currentUser && <CartIcon />}

                        <button
                            className="ml-4 text-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-3 space-y-2">
                        <Link
                            to="/"
                            className="block py-2 text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="block py-2 text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>

                        {currentUser && (
                            <Link
                                to="/orders"
                                className="block py-2 text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Orders
                            </Link>
                        )}

                        {currentUser ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="block py-2 text-gray-700 hover:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Your Profile
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin/products"
                                        className="block py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block py-2 text-gray-700 hover:text-blue-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block py-2 text-gray-700 hover:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block py-2 text-gray-700 hover:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;