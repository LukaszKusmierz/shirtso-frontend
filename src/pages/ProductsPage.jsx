import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../api/products';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get filter values from URL params
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')) : null;
    const subcategoryId = searchParams.get('subcategoryId') ? parseInt(searchParams.get('subcategoryId')) : null;
    const size = searchParams.get('size') || null;
    const stockFilter = searchParams.get('stock') || 'all';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response;

                // Fetch products based on filters
                if (subcategoryId) {
                    response = await productService.getProductsByCategory(subcategoryId);
                } else if (size) {
                    response = await productService.getProductsBySize(size);
                } else if (stockFilter === 'in-stock') {
                    response = await productService.getProductsInStock();
                } else if (stockFilter === 'not-in-stock') {
                    response = await productService.getProductsNotInStock();
                } else if (stockFilter === 'top-up-stock') {
                    response = await productService.getProductsTopUpStock();
                } else {
                    response = await productService.getAllProducts();
                }

                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [subcategoryId, size, stockFilter]);

    const handleFilterChange = (filters) => {
        const newParams = new URLSearchParams(searchParams);

        // Update category ID if provided
        if (filters.categoryId !== undefined) {
            if (filters.categoryId === null) {
                newParams.delete('categoryId');
            } else {
                newParams.set('categoryId', filters.categoryId);
            }
        }

        // Update subcategory ID if provided
        if (filters.subcategoryId !== undefined) {
            if (filters.subcategoryId === null) {
                newParams.delete('subcategoryId');
            } else {
                newParams.set('subcategoryId', filters.subcategoryId);
            }
        }

        // Update size if provided
        if (filters.size !== undefined) {
            if (filters.size === null) {
                newParams.delete('size');
            } else {
                newParams.set('size', filters.size);
            }
        }

        // Update stock filter if provided
        if (filters.stockFilter !== undefined) {
            if (filters.stockFilter === 'all') {
                newParams.delete('stock');
            } else {
                newParams.set('stock', filters.stockFilter);
            }
        }

        setSearchParams(newParams);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Products</h1>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar Filters */}
                <div className="lg:w-1/4 lg:pr-8 mb-6 lg:mb-0">
                    <ProductFilters
                        onFilterChange={handleFilterChange}
                        selectedCategoryId={categoryId}
                        selectedSubcategoryId={subcategoryId}
                        selectedSize={size}
                        stockFilter={stockFilter}
                    />
                </div>

                {/* Products Grid */}
                <div className="lg:w-3/4">
                    <ProductList
                        products={products}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
