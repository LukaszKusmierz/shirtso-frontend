import React, {useState, useEffect, useCallback, useRef} from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import {
    getAllProducts,
    getProductsBySubcategory,
    getProductsInStock,
    getProductsByName,
    getProductsBySizeAndSubcategory,
    getProductsBySize,
    getProductsByCategoryId,
    getProductsBySizeAndCategory
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

        console.log('URL params - categoryId:', categoryId, 'subcategoryId:', subcategoryId);

        setFilters((prev) => ({
            categoryId: categoryId || null,
            subcategoryId: subcategoryId || null,
            size: size || null,
            search: search || '',
            inStock: false,
        }));
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
                    productFunction = getProductsByName;
                    args = [filters.search];
                    console.log('Using getProductsByName with:', filters.search);
                } else if (filters.size && filters.subcategoryId) {
                    productFunction = getProductsBySizeAndSubcategory;
                    args = [filters.size, filters.subcategoryId];
                    console.log('Using getProductsBySizeAndSubcategory with:', filters.size, filters.subcategoryId);
                } else if (filters.size && filters.categoryId) {
                    productFunction = getProductsBySizeAndCategory;
                    args = [filters.size, filters.categoryId];
                } else if (filters.subcategoryId) {
                    productFunction = getProductsBySubcategory;
                    args = [filters.subcategoryId];
                    console.log('Using getProductsBySubcategory with:', filters.subcategoryId);
                } else if (filters.categoryId) {
                    productFunction = getProductsByCategoryId;
                    args = [filters.categoryId];
                    console.log('Using getProductsByCategoryId with:', filters.categoryId);
                } else if (filters.size) {
                    productFunction = getProductsBySize;
                    args = [filters.size];
                    console.log('Using getProductsBySize with:', filters.size);
                } else if (filters.inStock) {
                    productFunction = getProductsInStock;
                    console.log('Using getProductsInStock');
                } else {
                    productFunction = getAllProducts;
                    console.log('Using getAllProducts');
                }
                const data = await productFunction(...args);
                console.log('Fetched products count:', data.length);
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
    }, [filtersInitialized, filters.subcategoryId, filters.size, filters.inStock, filters.search, filters.categoryId]);

    useEffect(() => {
        let result = [...products];

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
        const search = e.target.search.value;

        setFilters((prev) => ({
            ...prev,
            search: search,
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
