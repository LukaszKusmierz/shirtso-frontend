import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { validate } from '../../utils/Helpers';

const currencies = ['PLN', 'EUR', 'USD', 'GBP'];

const EditGroupedProductForm = ({ groupedProduct, categories, subcategories, onCategoryChange, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        currency: 'PLN',
        categoryId: '',
        subcategoryId: '',
        supplier: ''
    });

    const [sizeStocks, setSizeStocks] = useState({});
    const [originalSizeStocks, setOriginalSizeStocks] = useState({});
    const [originalFormData, setOriginalFormData] = useState({});
    const [categoryId, setCategoryId] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeForm = async () => {
            if (!groupedProduct || categories.length === 0) return;

            setIsLoading(true);

            try {
                const initialFormData = {
                    productName: groupedProduct.productName || '',
                    description: groupedProduct.description || '',
                    price: groupedProduct.price || '',
                    currency: groupedProduct.currency || 'PLN',
                    categoryId: groupedProduct.categoryId || '',
                    subcategoryId: groupedProduct.subcategoryId || '',
                    supplier: groupedProduct.supplier || ''
                };

                // Initialize size stocks
                const stocks = {};
                groupedProduct.sizeVariants?.forEach(variant => {
                    stocks[variant.size] = {
                        stock: variant.stock,
                        productId: variant.productId
                    };
                });
                setSizeStocks(stocks);
                setOriginalSizeStocks(JSON.parse(JSON.stringify(stocks)));

                // Use categoryId directly from groupedProduct
                if (initialFormData.categoryId) {
                    const catId = String(initialFormData.categoryId);
                    setCategoryId(catId);
                    // Load subcategories for this category
                    await onCategoryChange(initialFormData.categoryId);
                }

                // Set form data and original form data AFTER subcategories are loaded
                setFormData(initialFormData);
                setOriginalFormData(initialFormData);
            } catch (error) {
                console.error('Error initializing form:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeForm();
    }, [groupedProduct, categories, onCategoryChange]);

    const validateForm = () => {
        const validationErrors = validate(formData, categoryId);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'categoryId') {
            setCategoryId(value);
            onCategoryChange(value);
            setFormData(prev => ({
                ...prev,
                subcategoryId: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'subcategoryId'
                    ? value === '' ? '' : Number(value)
                    : value
            }));
        }
    };

    const handleStockChange = (size, stock) => {
        setSizeStocks(prev => ({
            ...prev,
            [size]: {
                ...prev[size],
                stock: parseInt(stock) || 0
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Check if common fields changed
            const commonFieldsChanged =
                formData.productName !== originalFormData.productName ||
                formData.description !== originalFormData.description ||
                parseFloat(formData.price) !== parseFloat(originalFormData.price) ||
                formData.currency !== originalFormData.currency ||
                Number(formData.subcategoryId) !== Number(originalFormData.subcategoryId) ||
                formData.supplier !== originalFormData.supplier;

            // Prepare updates only for changed variants
            const updates = [];

            Object.entries(sizeStocks).forEach(([size, data]) => {
                const originalStock = originalSizeStocks[size]?.stock;
                const stockChanged = data.stock !== originalStock;

                // Update if common fields changed OR this variant's stock changed
                if (commonFieldsChanged || stockChanged) {
                    updates.push({
                        productId: data.productId,
                        size,
                        stock: data.stock,
                        ...formData,
                        price: parseFloat(formData.price)
                    });
                }
            });

            if (updates.length === 0) {
                console.log('No changes detected');
                setIsSubmitting(false);
                return;
            }

            await onSubmit(updates);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center items-center py-8">
                    <p className="text-gray-600">Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Product Group</h2>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Changes to product name, description, price, category, and supplier will apply to all {Object.keys(sizeStocks).length} size variants.
                    Stock levels can be managed individually per size. Only changed variants will be updated.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.productName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.productName && (
                            <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier *
                        </label>
                        <input
                            type="text"
                            id="supplier"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.supplier ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.supplier && (
                            <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price * (applies to all variants)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                            Currency *
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.currency ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                        {errors.currency && (
                            <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={categoryId}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory *
                        </label>
                        <select
                            id="subcategoryId"
                            name="subcategoryId"
                            value={formData.subcategoryId}
                            onChange={handleChange}
                            disabled={!categoryId || subcategories.length === 0}
                            className={`w-full p-2 border rounded ${errors.subcategoryId ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Subcategory</option>
                            {subcategories.map(subcategory => (
                                <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                                    {subcategory.subcategoryName}
                                </option>
                            ))}
                        </select>
                        {errors.subcategoryId && (
                            <p className="mt-1 text-sm text-red-600">{errors.subcategoryId}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    ></textarea>
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                {/* Size Stock Management */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Stock by Size</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.entries(sizeStocks).sort(([a], [b]) => {
                            const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
                            return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
                        }).map(([size, data]) => (
                            <div key={size} className="border rounded p-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size {size}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => handleStockChange(size, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <p className="text-xs text-gray-500 mt-1">ID: {data.productId}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="px-6"
                    >
                        {isSubmitting ? 'Updating Products...' : 'Update All Variants'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditGroupedProductForm;