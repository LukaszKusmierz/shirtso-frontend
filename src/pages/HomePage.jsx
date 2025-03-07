import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import ProductList from '../components/products/ProductList';
import { productService } from '../api/products';

const HomePage = () => {
    const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch first page of products
                const response = await productService.getAllProducts(0, 8);
                setFeaturedProducts(response?.data || []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        // Only fetch products after authentication check is complete
        if (!authLoading) {
            fetchProducts();
        }
    }, [authLoading]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="bg-gray-100 rounded-lg p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome {isAuthenticated ? currentUser?.username : 'to SHIRTSO'}
                </h1>
                <p className="text-gray-600 mb-6">
                    Your premium destination for men's fashion. Quality clothing for every occasion.
                </p>
                <a
                    href="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Shop Now
                </a>
            </div>

            {/* Featured Products */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>

                {error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                        {error}
                    </div>
                ) : null}

                <ProductList
                    products={featuredProducts}
                    loading={loading}
                    error={error}
                />
            </div>

            {/* Categories Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Example category cards - replace with your actual categories */}
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium mb-2">Outerwear</h3>
                        <a href="/products?category=1" className="text-blue-600 hover:underline">View Products</a>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium mb-2">Casual Clothing</h3>
                        <a href="/products?category=2" className="text-blue-600 hover:underline">View Products</a>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium mb-2">Formal Wear</h3>
                        <a href="/products?category=3" className="text-blue-600 hover:underline">View Products</a>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium mb-2">Pants & Shorts</h3>
                        <a href="/products?category=4" className="text-blue-600 hover:underline">View Products</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
