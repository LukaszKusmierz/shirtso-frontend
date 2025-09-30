import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { validate } from '../../utils/Helpers';

const currencies = ['PLN', 'EUR', 'USD', 'GBP'];

const NewProductForm = ({ categories, subcategories, sizes, onCategoryChange, onSubmit }) => {
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        currency: 'PLN',
        subcategoryId: '',
        supplier: '',
        stock: 0,
        size: ''
    });

    const [categoryId, setCategoryId] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (categoryId) {
            setFormData(prev => ({ ...prev, subcategoryId: '' }));
        }
    }, [categoryId]);

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
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock' || name === 'subcategoryId'
                    ? value === '' ? '' : Number(value)
                    : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            const success = await onSubmit(productData);

            if (success) {
                setFormData({
                    productName: '',
                    description: '',
                    price: '',
                    currency: 'PLN',
                    subcategoryId: '',
                    supplier: '',
                    stock: 0,
                    size: ''
                });
                setCategoryId('');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Add New Product</h2>

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
                            Price *
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
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock *
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            className={`w-full p-2 border rounded ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.stock && (
                            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                            Size *
                        </label>
                        <select
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Size</option>
                            {sizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        {errors.size && (
                            <p className="mt-1 text-sm text-red-600">{errors.size}</p>
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

                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth={false}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="px-6"
                    >
                        {isSubmitting ? 'Creating Product...' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewProductForm;
