import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { productService } from '../../api/products';
import { categoryService } from '../../api/categories';

// Product Form component for adding/editing products
const ProductForm = ({ product, onSubmit, isEditing }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        currency: 'PLN',
        imageId: '',
        subcategoryId: '',
        supplier: '',
        stock: '',
        size: 'M'
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (product && isEditing) {
            setFormData({
                productName: product.productName || '',
                description: product.description || '',
                price: product.price ? product.price.toString() : '',
                currency: product.currency || 'PLN',
                imageId: product.imageId ? product.imageId.toString() : '',
                subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : '',
                supplier: product.supplier || '',
                stock: product.stock ? product.stock.toString() : '',
                size: product.size || 'M'
            });

            // Fetch subcategories for the product's category
            if (product.subcategoryId) {
                fetchSubcategories(product.subcategoryId);
            }
        }
    }, [product, isEditing]);

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await categoryService.getSubcategoriesByCategory(categoryId);
            setSubcategories(response.data);
            setSelectedCategory(categoryId);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setFormData(prev => ({ ...prev, subcategoryId: '' }));

        if (categoryId) {
            fetchSubcategories(categoryId);
        } else {
            setSubcategories([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.productName.trim()) errors.productName = 'Product name is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.price) {
            errors.price = 'Price is required';
        } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            errors.price = 'Price must be a positive number';
        }
        if (!formData.imageId.trim()) errors.imageId = 'Image ID is required';
        if (!formData.subcategoryId) errors.subcategoryId = 'Subcategory is required';
        if (!formData.supplier.trim()) errors.supplier = 'Supplier is required';
        if (!formData.stock) {
            errors.stock = 'Stock is required';
        } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
            errors.stock = 'Stock must be a non-negative number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                imageId: parseInt(formData.imageId),
                subcategoryId: parseInt(formData.subcategoryId),
                stock: parseInt(formData.stock)
            };

            onSubmit(productData);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="productName"
                        id="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            formErrors.productName ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.productName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.productName}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                        Supplier
                    </label>
                    <input
                        type="text"
                        name="supplier"
                        id="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            formErrors.supplier ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.supplier && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.supplier}</p>
                    )}
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            formErrors.description ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            formErrors.price ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.price && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Currency
                    </label>
                    <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="PLN">PLN</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="imageId" className="block text-sm font-medium text-gray-700">
                        Image ID
                    </label>
                    <input
                        type="text"
                        name="imageId"
                        id="imageId"
                        value={formData.imageId}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            formErrors.imageId ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.imageId && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.imageId}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={selectedCategory || ''}
                        onChange={handleCategoryChange}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700">
                        Subcategory
                    </label>
                    <select
                        id="subcategoryId"
                        name="subcategoryId"
                        value={formData.subcategoryId}
                        onChange={handleChange}
                        disabled={!selectedCategory}
                        className={`mt-1 block w-full bg-white border ${
                            formErrors.subcategoryId ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map(subcategory => (
                            <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                                {subcategory.subcategoryName}
                            </option>
                        ))}
                    </select>
                    {formErrors.subcategoryId && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.subcategoryId}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stock
                    </label>
                    <input
                        type="text"
                        name="stock"
                        id="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            formErrors.stock ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.stock && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Size
                    </label>
                    <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Link
                    to="/admin/products"
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditing ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </form>
    );
};

// Product List component
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        navigate('/admin/products/add');
    };

    const handleEditProduct = (productId) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">Products</h3>
                <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Product
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {products.map(product => (
                        <li key={`${product.productId}-${product.size}`}>
                            <div className="px-4 py-4 flex items-center sm:px-6">
                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex">
                                            <h4 className="text-lg font-medium text-blue-600 truncate">{product.productName}</h4>
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.size}
                      </span>
                                        </div>
                                        <div className="mt-2 flex">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <p>Price: {product.price.toFixed(2)} {product.currency}</p>
                                                <span className="mx-2">•</span>
                                                <p>Stock: {product.stock}</p>
                                                <span className="mx-2">•</span>
                                                <p>Subcategory ID: {product.subcategoryId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-5 flex-shrink-0">
                                    <button
                                        onClick={() => handleEditProduct(product.productId)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Add Product component
const AddProduct = () => {
    const navigate = useNavigate();

    const handleSubmit = async (productData) => {
        try {
            await productService.addProduct(productData);
            navigate('/admin/products');
        } catch (error) {
            console.error('Error adding product:', error);
            // Handle error
        }
    };

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Add New Product</h3>
            <ProductForm onSubmit={handleSubmit} isEditing={false} />
        </div>
    );
};

// Edit Product component
const EditProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (productData) => {
        try {
            // Call your API to update the product
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            // Handle error
        }
    };

    // Simulating fetching product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // In a real app, you would fetch the specific product data
                // For now, we'll simulate loading a product
                await new Promise(resolve => setTimeout(resolve, 800));

                setProduct({
                    productId: '1234',
                    productName: 'Sample Product',
                    description: 'This is a sample product description',
                    price: 199.99,
                    currency: 'PLN',
                    imageId: 123,
                    subcategoryId: 5,
                    supplier: 'Sample Supplier',
                    stock: 25,
                    size: 'L'
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to load product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Edit Product</h3>
            {product && <ProductForm product={product} onSubmit={handleSubmit} isEditing={true} />}
        </div>
    );
};

// Main Product Management component
const ProductManagement = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
    );
};

export default ProductManagement;
