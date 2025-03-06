import React from 'react';
import ProductCard from '../common/ProductCard';

const ProductList = ({ products, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded">
                <p>Error loading products: {error}</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
                <p>No products found. Try different filters or check back later.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={`${product.productId}-${product.size}`} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
