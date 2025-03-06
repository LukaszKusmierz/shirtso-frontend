import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
                Return to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;
