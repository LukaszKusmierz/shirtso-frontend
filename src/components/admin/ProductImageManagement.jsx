import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { getAllProducts, addNewProduct } from '../../services/ProductService';
import { getAllCategories } from '../../services/CategoryService';
import { getSubcategoriesByCategory } from '../../services/CategoryService';
import { getSizes } from '../../services/ProductService';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import NewProductForm from './NewProductForm';
import ProductsTable from './ProductsTable';

const ProductImageManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'new'

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Check if user has admin role
    useEffect(() => {
        if (!currentUser || !currentUser.roles || !currentUser.roles.includes('USER_WRITE')) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // Fetch products, categories, and sizes on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData, sizesData] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                    getSizes()
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
                setSizes(sizesData);
                setError(null);
            } catch (err) {
                setError('Failed to load data: ' + (err.message || 'Unknown error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle category change to load subcategories
    const handleCategoryChange = async (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }

        try {
            const subcategoriesData = await getSubcategoriesByCategory(categoryId);
            setSubcategories(subcategoriesData);
        } catch (err) {
            console.error('Failed to load subcategories:', err);
            setError('Failed to load subcategories');
        }
    };

    // Handle product creation
    const handleCreateProduct = async (productData) => {
        try {
            setLoading(true);
            const newProduct = await addNewProduct(productData);

            // Add new product to the list
            setProducts([...products, newProduct]);

            setSuccessMessage('Product created successfully!');
            setActiveTab('products'); // Switch back to products list

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return true;
        } catch (err) {
            setError('Failed to create product: ' + (err.message || 'Unknown error'));
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    if (loading && !products.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Product Management</h1>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    dismissible={true}
                    onDismiss={() => setSuccessMessage(null)}
                    className="mb-4"
                />
            )}

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                                activeTab === 'products'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Products List
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                                activeTab === 'new'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Add New Product
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'products' ? (
                <ProductsTable products={products} />
            ) : (
                <NewProductForm
                    categories={categories}
                    subcategories={subcategories}
                    sizes={sizes}
                    onCategoryChange={handleCategoryChange}
                    onSubmit={handleCreateProduct}
                />
            )}
        </div>
    );
};

export default ProductImageManagement;
