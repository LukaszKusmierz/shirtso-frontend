import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import CartIcon from '../cart/CartIcon';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('USER_WRITE');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }

            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsUserMenuOpen(false);
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    };

    const closeAllMenus = () => {
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    };

    const toggleUserMenu = (e) => {
        e.stopPropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
        setIsMenuOpen(false);
    };

    const toggleMobileMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
        setIsUserMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-blue-600"
                        onClick={closeAllMenus}
                    >
                        Shirtso
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={closeAllMenus}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={closeAllMenus}
                        >
                            Products
                        </Link>

                        {currentUser && (
                            <Link
                                to="/orders"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={closeAllMenus}
                            >
                                Orders
                            </Link>
                        )}

                        {currentUser ? (
                            <div className="flex items-center space-x-4">
                                <CartIcon />

                                {/* User Dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={toggleUserMenu}
                                        className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
                                        aria-expanded={isUserMenuOpen}
                                        aria-haspopup="true"
                                    >
                                        <span className="mr-1">Hello, {currentUser.userName}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={closeAllMenus}
                                            >
                                                Your Profile
                                            </Link>

                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={closeAllMenus}
                                            >
                                                Your Orders
                                            </Link>

                                            {isAdmin && (
                                                <>
                                                    <hr className="my-1" />
                                                    <Link
                                                        to="/admin/products"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                        onClick={closeAllMenus}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                </>
                                            )}

                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={closeAllMenus}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={closeAllMenus}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu-but */}
                    <div className="flex items-center md:hidden">
                        {currentUser && <CartIcon />}

                        <button
                            className="ml-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                            onClick={toggleMobileMenu}
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle mobile menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav-menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-3 space-y-2 border-t border-gray-200 pt-3" ref={mobileMenuRef}>
                        <Link
                            to="/"
                            className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={closeAllMenus}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={closeAllMenus}
                        >
                            Products
                        </Link>

                        {currentUser && (
                            <Link
                                to="/orders"
                                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={closeAllMenus}
                            >
                                Orders
                            </Link>
                        )}

                        {currentUser ? (
                            <>
                                <hr className="my-2" />
                                <div className="py-2">
                                    <span className="text-sm text-gray-500">Logged in as {currentUser.userName}</span>
                                </div>

                                <Link
                                    to="/profile"
                                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={closeAllMenus}
                                >
                                    Your Profile
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin/products"
                                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={closeAllMenus}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors text-left w-full"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <hr className="my-2" />
                                <Link
                                    to="/login"
                                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={closeAllMenus}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={closeAllMenus}
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