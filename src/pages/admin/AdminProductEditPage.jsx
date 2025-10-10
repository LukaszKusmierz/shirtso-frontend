import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { updateProduct, getSizes, getGroupedProductByVariantId } from '../../services/ProductService';
import { getAllCategories, getSubcategoriesByCategory } from '../../services/CategoryService';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import EditGroupedProductForm from '../../components/admin/EditGroupedProductForm';

const AdminProductEditPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [groupedProduct, setGroupedProduct] = useState(location.state?.groupedProduct || null);
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

                // Fetch grouped product if not in state
                let product = groupedProduct;
                if (!product) {
                    product = await getGroupedProductByVariantId(id);
                    setGroupedProduct(product);
                }

                const [categoriesData, sizesData] = await Promise.all([
                    getAllCategories(),
                    getSizes()
                ]);

                setCategories(categoriesData);
                setSizes(sizesData);

                setError(null);
            } catch (err) {
                setError('Failed to load product: ' + (err.message || 'Unknown error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, groupedProduct]);

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

    const handleUpdateProducts = async (updates) => {
        try {
            setLoading(true);

            // Update all variants
            const updatePromises = updates.map(updateData =>
                updateProduct(updateData.productId, updateData)
            );

            await Promise.all(updatePromises);

            setSuccessMessage(`Successfully updated all ${updates.length} product variants!`);

            setTimeout(() => {
                navigate('/admin/products');
            }, 2000);

            return true;
        } catch (err) {
            setError('Failed to update products: ' + (err.message || 'Unknown error'));
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/products');
    };

    if (loading && !groupedProduct) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!groupedProduct) {
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

            <h1 className="text-2xl font-bold mb-6">Edit Product Group: {groupedProduct.productName}</h1>

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

            <EditGroupedProductForm
                groupedProduct={groupedProduct}
                categories={categories}
                subcategories={subcategories}
                sizes={sizes}
                onCategoryChange={handleCategoryChange}
                onSubmit={handleUpdateProducts}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default AdminProductEditPage;