import React, { useState } from 'react';
import GroupedProductCard from './GroupedProductCard';

const GroupedProductList = ({ products, loading, error }) => {
    const [sortBy, setSortBy] = useState('name');

    const sortProducts = () => {
        if (!products || products.length === 0) return [];

        return [...products].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'stock':
                    return b.totalStock - a.totalStock;
                case 'name':
                default:
                    return a.productName.localeCompare(b.productName);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                Error loading products: {error}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No products found</p>
            </div>
        );
    }

    const sortedProducts = sortProducts();

    const totalVariants = products.reduce((sum, product) =>
        sum + product.sizeVariants.length, 0
    );

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div className="text-gray-600">
                    Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                    {' '}({totalVariants} {totalVariants === 1 ? 'variant' : 'variants'})
                </div>
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="stock">Availability</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product, index) => (
                    <GroupedProductCard
                        key={`${product.productName}-${index}`}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};

export default GroupedProductList;

//TODO: update filtering by size(single size product card and product list)