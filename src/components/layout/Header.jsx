import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

                        {currentUser ? (
                            <>
                                <span className="text-gray-700">Hello, {currentUser.userName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Logout
                                </button>
                            </>
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

                    <button
                        className="md:hidden text-gray-700"
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

                        {currentUser ? (
                            <>
                                <span className="block py-2 text-gray-700">Hello, {currentUser.username}</span>
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