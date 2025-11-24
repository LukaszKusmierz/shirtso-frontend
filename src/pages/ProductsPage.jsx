import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GroupedProductList from '../components/products/GroupedProductList';
import ProductFilters from '../components/products/ProductFilters';
import {
    getAllGroupedProducts,
    getGroupedProductsBySubcategory,
    getGroupedProductsByName,
    getGroupedProductsBySizeAndSubcategory,
    getProductsBySize,
    getGroupedProductsByCategory,
    getGroupedProductsBySizeAndCategory,
} from '../services/ProductService';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        categoryId: null,
        subcategoryId: null,
        size: null,
        inStock: false,
        search: '',
    });

    const [filtersInitialized, setFiltersInitialized] = useState(false);

    const location = useLocation();
    const fetchingRef = useRef(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryId = searchParams.get('categoryId');
        const subcategoryId = searchParams.get('subcategoryId');
        const size = searchParams.get('size');
        const search = searchParams.get('search');

        setFilters({
            categoryId: categoryId || null,
            subcategoryId: subcategoryId || null,
            size: size || null,
            search: search || '',
            inStock: false,
        });
        setFiltersInitialized(true);
    }, [location.search]);

    useEffect(() => {
        if (!filtersInitialized) return;
        if (fetchingRef.current) return;

        const fetchProducts = async () => {
            fetchingRef.current = true;
            setLoading(true);
            setError(null);

            try {
                let productFunction;
                let args = [];

                if (filters.search) {
                    productFunction = getGroupedProductsByName;
                    args = [filters.search];
                } else if (filters.size && filters.subcategoryId) {
                    productFunction = getGroupedProductsBySizeAndSubcategory;
                    args = [filters.size, filters.subcategoryId];
                } else if (filters.size && filters.categoryId) {
                    productFunction = getGroupedProductsBySizeAndCategory;
                    args = [filters.size, filters.categoryId];
                } else if (filters.subcategoryId) {
                    productFunction = getGroupedProductsBySubcategory;
                    args = [filters.subcategoryId];
                } else if (filters.categoryId) {
                    productFunction = getGroupedProductsByCategory;
                    args = [filters.categoryId];
                } else if (filters.size) {
                    productFunction = getProductsBySize;
                    args = [filters.size];
                } else {
                    productFunction = getAllGroupedProducts;
                }

                const data = await productFunction(...args);
                setProducts(data);
            } catch (err) {
                setError('Failed to load products');
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        };

        fetchProducts();
    }, [filtersInitialized, filters]);

    useEffect(() => {
        let result = [...products];

        if (filters.inStock) {
            result = result.filter((product) => product.totalStock > 0);
        }

        setFilteredProducts(result);
    }, [products, filters.inStock]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
        }));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const search = e.target.search.value.trim();

        setFilters((prev) => ({
            ...prev,
            search,
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search products..."
                        defaultValue={filters.search}
                        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 focus:outline-none"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                    {filtersInitialized && (
                        <ProductFilters
                            currentFilters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    )}
                </div>

                <div className="md:w-3/4">
                    <GroupedProductList
                        products={filteredProducts}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
