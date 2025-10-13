import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shirtso</h3>
                        <div className="text-gray-300 space-y-1">
                            <p>We will dress you up!</p>
                            <p>The best men's fashion in one place.</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-300 hover:text-white">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-300 hover:text-white">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-white">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <address className="text-gray-300 not-italic">
                            <p>123 Fashion Street</p>
                            <p>Style City, SC 12345</p>
                            <p>Email: info@shirtso.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </address>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Shirtso. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;