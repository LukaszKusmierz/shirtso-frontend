import React, { useState, useEffect } from 'react';
import {getAllCategories, getSubcategoriesByCategory} from '../../services/CategoryService';
import {getSizes} from "../../services/ProductService";

const ProductFilters = ({ currentFilters, onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!currentFilters.categoryId) {
            setSubcategories([]);
            return;
        }
        const fetchSubcategories = async () => {
            try {
                const data = await getSubcategoriesByCategory(currentFilters.categoryId);
                setSubcategories(data);
            } catch (err) {
                console.error('Failed to load subcategories:', err);
            }
        };

        fetchSubcategories();
    }, [currentFilters.categoryId]);

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const data = await getSizes();
                setSizes(data);
            } catch (err) {
                setError('Failed to load sizes');
                console.error(err);
            }
        };

        fetchSizes();
    }, []);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        onFilterChange({
            categoryId: categoryId || null,
            subcategoryId: null, // Reset subcategory when category changes
            size: currentFilters.size,
            inStock: currentFilters.inStock,
            search: currentFilters.search,
        });
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        onFilterChange({
            ...currentFilters,
            subcategoryId: subcategoryId || null,
        });
    };

    const handleSizeChange = (e) => {
        const size = e.target.value;
        onFilterChange({
            ...currentFilters,
            size: size || null,
        });
    };

    const handleStockChange = (e) => {
        onFilterChange({
            ...currentFilters,
            inStock: e.target.checked,
        });
    };

    const resetFilters = () => {
        onFilterChange({
            categoryId: null,
            subcategoryId: null,
            size: null,
            inStock: false,
            search: '',
        });
    };

    if (loading) {
        return <div className="animate-pulse p-4 bg-gray-100 rounded-lg">Loading filters...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={currentFilters.categoryId || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {subcategories.length > 0 && (
                    <div>
                        <label className="block text-gray-700 mb-2">Subcategory</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={currentFilters.subcategoryId || ''}
                            onChange={handleSubcategoryChange}
                        >
                            <option value="">All Subcategories</option>
                            {subcategories.map((subcategory) => (
                                <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                                    {subcategory.subcategoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 mb-2">Size</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={currentFilters.size || ''}
                        onChange={handleSizeChange}
                    >
                        <option value="">All Sizes</option>
                        {sizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="inStockOnly"
                        checked={currentFilters.inStock}
                        onChange={handleStockChange}
                        className="mr-2"
                    />
                    <label htmlFor="inStockOnly" className="text-gray-700">
                        In Stock Only
                    </label>
                </div>

                <button
                    onClick={resetFilters}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default ProductFilters;
