import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../services/CategoryService';
import { getGroupedProductsInStock } from '../services/ProductService';
import GroupedProductCard from '../components/products/GroupedProductCard';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, productsData] = await Promise.all([
                    getAllCategories(),
                    getGroupedProductsInStock()
                ]);
                setCategories(categoriesData);
                // Show first 4 grouped products
                setFeaturedProducts(productsData.slice(0, 4));
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Hero Section */}
            <section className="mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-10 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Shirtso</h1>
                    <p className="text-xl mb-6">Here you can enjoy a successful shopping experience.</p>
                    <Link
                        to="/products"
                        className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Products
                    </Link>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

                {featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product, index) => (
                            <GroupedProductCard
                                key={`${product.productName}-${index}`}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
                        No featured products available
                    </p>
                )}

                <div className="text-center mt-8">
                    <Link
                        to="/products"
                        className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        View All Products →
                    </Link>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.categoryId}
                            to={`/products?categoryId=${category.categoryId}`}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
                        >
                            <h3 className="text-lg font-semibold mb-2">{category.categoryName}</h3>
                            <span className="text-blue-600">Shop Now →</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;