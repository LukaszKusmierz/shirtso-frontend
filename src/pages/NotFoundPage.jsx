import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
            <p className="text-2xl text-gray-600 mb-8">Page not found</p>
            <p className="text-gray-500 mb-8">
                The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;
