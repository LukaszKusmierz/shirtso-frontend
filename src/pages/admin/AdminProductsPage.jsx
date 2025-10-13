import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { addNewProduct, getSizes } from '../../services/ProductService';
import { getAllCategoriesWithSubcategories, getSubcategoriesByCategory } from '../../services/CategoryService';
import { getAllGroupedProducts } from '../../services/ProductService';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import NewProductForm from '../../components/admin/NewProductForm';
import GroupedProductsTable from '../../components/admin/GroupedProductsTable';

const AdminProductsPage = () => {
    const [groupedProducts, setGroupedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('products');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || !currentUser.roles || !currentUser.roles.includes('USER_WRITE')) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData, sizesData] = await Promise.all([
                    getAllGroupedProducts(),
                    getAllCategoriesWithSubcategories(),
                    getSizes()
                ]);
                setGroupedProducts(productsData);
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

    const handleCategoryChange = useCallback(async (categoryId) => {
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
    }, []);

    const handleCreateProduct = async (productData) => {
        try {
            setLoading(true);
            await addNewProduct(productData);

            // Refresh grouped products
            const productsData = await getAllGroupedProducts();
            setGroupedProducts(productsData);

            setSuccessMessage('Product created successfully!');
            setActiveTab('products');
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

    if (loading && !groupedProducts.length) {
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
                            Products List ({groupedProducts.length} groups)
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
                <GroupedProductsTable products={groupedProducts} />
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

export default AdminProductsPage;