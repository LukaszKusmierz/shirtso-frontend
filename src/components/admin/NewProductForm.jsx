import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const currencies = ['PLN', 'EUR', 'USD', 'GBP'];

const NewProductForm = ({ categories, subcategories, sizes, onCategoryChange, onSubmit }) => {
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        currency: 'PLN',
        imageId: 0,
        subcategoryId: '',
        supplier: '',
        stock: 0,
        size: ''
    });

    const [categoryId, setCategoryId] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Reset subcategory when category changes
        if (categoryId) {
            setFormData(prev => ({ ...prev, subcategoryId: '' }));
        }
    }, [categoryId]);

    const validate = () => {
        let tempErrors = {};
        if (!formData.productName) tempErrors.productName = 'Product name is required';
        if (formData.productName && (formData.productName.length < 3 || formData.productName.length > 20))
            tempErrors.productName = 'Product name must be between 3 and 20 characters';

        if (!formData.description) tempErrors.description = 'Description is required';

        if (!formData.price) tempErrors.price = 'Price is required';
        if (formData.price && isNaN(parseFloat(formData.price)))
            tempErrors.price = 'Price must be a number';
        if (formData.price && parseFloat(formData.price) <= 0)
            tempErrors.price = 'Price must be greater than zero';

        if (!formData.currency) tempErrors.currency = 'Currency is required';

        if (!categoryId) tempErrors.categoryId = 'Category is required';
        if (!formData.subcategoryId) tempErrors.subcategoryId = 'Subcategory is required';

        if (!formData.supplier) tempErrors.supplier = 'Supplier is required';

        if (formData.stock === '' || isNaN(parseInt(formData.stock)))
            tempErrors.stock = 'Stock must be a number';

        if (!formData.size) tempErrors.size = 'Size is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'categoryId') {
            setCategoryId(value);
            onCategoryChange(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock' || name === 'imageId' || name === 'subcategoryId'
                    ? value === '' ? '' : Number(value)
                    : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Format data for API
            const productData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            const success = await onSubmit(productData);

            if (success) {
                // Reset form
                setFormData({
                    productName: '',
                    description: '',
                    price: '',
                    currency: 'PLN',
                    imageId: 0,
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
                    {/* Product Name */}
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

                    {/* Supplier */}
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

                    {/* Price */}
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

                    {/* Currency */}
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

                    {/* Stock */}
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

                    {/* Size */}
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

                    {/* Category */}
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

                    {/* Subcategory */}
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

                    {/* Image ID */}
                    <div>
                        <label htmlFor="imageId" className="block text-sm font-medium text-gray-700 mb-1">
                            Image ID
                        </label>
                        <input
                            type="number"
                            id="imageId"
                            name="imageId"
                            value={formData.imageId}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Optional: Enter an existing image ID or leave at 0 to add images later
                        </p>
                    </div>
                </div>

                {/* Description */}
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
