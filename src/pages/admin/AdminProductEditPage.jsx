import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { getProductById, updateProduct, getSizes } from '../../services/ProductService';
import { getAllCategories, getSubcategoriesByCategory } from '../../services/CategoryService';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EditProductForm from '../../components/admin/EditProductForm';

const AdminProductEditPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
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
                const [productData, categoriesData, sizesData] = await Promise.all([
                    getProductById(id),
                    getAllCategories(),
                    getSizes()
                ]);

                setProduct(productData);
                setCategories(categoriesData);
                setSizes(sizesData);

                if (productData.subcategoryId) {
                }

                setError(null);
            } catch (err) {
                setError('Failed to load product: ' + (err.message || 'Unknown error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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

    const handleUpdateProduct = async (productData) => {
        try {
            setLoading(true);
            const updatedProduct = await updateProduct(id, productData);
            setProduct(updatedProduct);
            setSuccessMessage('Product updated successfully!');

            setTimeout(() => {
                navigate('/admin/products');
            }, 2000);

            return true;
        } catch (err) {
            setError('Failed to update product: ' + (err.message || 'Unknown error'));
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/products');
    };

    if (loading && !product) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto p-4">
                <Alert
                    type="error"
                    message="Product not found"
                    dismissible={false}
                    className="mb-4"
                />
                <button
                    onClick={handleCancel}
                    className="text-blue-600 hover:underline flex items-center"
                >
                    <span className="mr-1">←</span> Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleCancel}
                className="text-blue-600 hover:underline flex items-center mb-4"
            >
                <span className="mr-1">←</span> Back to Products
            </button>

            <h1 className="text-2xl font-bold mb-6">Edit Product: {product.productName}</h1>

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

            <EditProductForm
                product={product}
                categories={categories}
                subcategories={subcategories}
                sizes={sizes}
                onCategoryChange={handleCategoryChange}
                onSubmit={handleUpdateProduct}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default AdminProductEditPage;