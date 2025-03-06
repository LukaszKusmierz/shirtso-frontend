import React, { useState, useEffect } from 'react';
import { categoryService } from '../../api/categories';

const ProductFilters = ({
                            onFilterChange,
                            selectedCategoryId,
                            selectedSubcategoryId,
                            selectedSize,
                            stockFilter
                        }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const stockOptions = [
        { id: 'all', name: 'All Products' },
        { id: 'in-stock', name: 'In Stock' },
        { id: 'not-in-stock', name: 'Out of Stock' },
        { id: 'top-up-stock', name: 'Low Stock (< 3)' }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategoriesWithSubcategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (selectedCategoryId) {
                try {
                    const response = await categoryService.getSubcategoriesByCategory(selectedCategoryId);
                    setSubcategories(response.data);
                } catch (error) {
                    console.error('Failed to fetch subcategories', error);
                }
            } else {
                setSubcategories([]);
            }
        };

        fetchSubcategories();
    }, [selectedCategoryId]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value ? parseInt(e.target.value) : null;
        onFilterChange({ categoryId, subcategoryId: null });
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value ? parseInt(e.target.value) : null;
        onFilterChange({ subcategoryId });
    };

    const handleSizeChange = (e) => {
        onFilterChange({ size: e.target.value || null });
    };

    const handleStockFilterChange = (e) => {
        onFilterChange({ stockFilter: e.target.value });
    };

    const resetFilters = () => {
        onFilterChange({
            categoryId: null,
            subcategoryId: null,
            size: null,
            stockFilter: 'all'
        });
    };

    const renderFilters = () => (
        <div className="space-y-6">
            {/* Category Filter */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={selectedCategoryId || ''}
                    onChange={handleCategoryChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subcategory Filter - Only show if a category is selected */}
            {selectedCategoryId && subcategories.length > 0 && (
                <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory
                    </label>
                    <select
                        id="subcategory"
                        name="subcategory"
                        value={selectedSubcategoryId || ''}
                        onChange={handleSubcategoryChange}
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">All Subcategories</option>
                        {subcategories.map(subcategory => (
                            <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                                {subcategory.subcategoryName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Size Filter */}
            <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                </label>
                <select
                    id="size"
                    name="size"
                    value={selectedSize || ''}
                    onChange={handleSizeChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            {/* Stock Filter */}
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                </label>
                <select
                    id="stock"
                    name="stock"
                    value={stockFilter || 'all'}
                    onChange={handleStockFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    {stockOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reset Filters Button */}
            <button
                onClick={resetFilters}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
                Reset Filters
            </button>
        </div>
    );

    return (
        <>
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md"
                >
                    <span className="font-medium">Filters</span>
                    <svg
                        className={`w-5 h-5 transition-transform ${showMobileFilters ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showMobileFilters && (
                    <div className="mt-4 p-4 bg-white rounded-md shadow">
                        {renderFilters()}
                    </div>
                )}
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:block">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                {renderFilters()}
            </div>
        </>
    );
};

export default ProductFilters;
