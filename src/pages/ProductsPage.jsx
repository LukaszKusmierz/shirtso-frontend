import React, {useState, useEffect, useCallback} from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import {
    getAllProducts,
    getProductsBySubcategory,
    getProductsInStock,
    getProductsByName,
    getProductsBySizeAndSubcategory,
    getProductsBySize
} from '../services/productService';

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

    const location = useLocation();

    // Parse URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryId = searchParams.get('categoryId');
        const subcategoryId = searchParams.get('subcategoryId');
        const size = searchParams.get('size');
        const search = searchParams.get('search');

        setFilters((prev) => ({
            ...prev,
            categoryId: categoryId || null,
            subcategoryId: subcategoryId || null,
            size: size || null,
            search: search || '',
        }));
    }, [location.search]);

    // Fetch products based on current filters
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                let data;

                if (filters.search) {
                    data = await getProductsByName(filters.search);
                } else if (filters.subcategoryId) {
                    data = await getProductsBySubcategory(filters.subcategoryId);
                } else if (filters.size) {
                    data = await getProductsBySize(filters.size);
                } else if (filters.size && filters.subcategoryId) {
                    data = await getProductsBySizeAndSubcategory(filters.size, filters.subcategoryId);
                } else if (filters.inStock) {
                    data = await getProductsInStock();
                } else {
                    data = await getAllProducts();
                }

                setProducts(data);
            } catch (err) {
                setError('Failed to load products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters.subcategoryId, filters.size, filters.inStock, filters.search]);

    // Apply client-side filtering for additional filter combinations
    useEffect(() => {
        let result = [...products];

        // Additional client-side filtering
        if (filters.inStock) {
            result = result.filter((product) => product.stock > 0);
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
        // Update search filter
        setFilters((prev) => ({
            ...prev,
            search: e.target.search.value,
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
                    <ProductFilters onFilterChange={handleFilterChange} />
                </div>

                <div className="md:w-3/4">
                    <ProductList
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