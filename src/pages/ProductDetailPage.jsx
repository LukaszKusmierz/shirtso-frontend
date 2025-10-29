import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GroupedProductDetails from '../components/products/GroupedProductDetails';
import {getGroupedProductByVariantId, getProductWithImages} from '../services/ProductService';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

const ProductDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [groupedProduct, setGroupedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupedProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if we already have the grouped product from navigation state
                if (location.state?.groupedProduct) {
                    setGroupedProduct(location.state.groupedProduct);
                    setLoading(false);
                    return;
                }

                // Otherwise, fetch from backend using the variant ID
                const data = await getProductWithImages(id);
                setGroupedProduct(data);
            } catch (err) {
                setError('Failed to load product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupedProduct();
    }, [id, location.state]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (error || !groupedProduct) {
        return (
            <div className="container mx-auto p-4">
                <Alert
                    type="error"
                    title="Error"
                    message={error || 'Product not found'}
                    dismissible={false}
                    className="mb-4"
                />
                <button
                    onClick={handleGoBack}
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
                onClick={handleGoBack}
                className="text-blue-600 hover:underline flex items-center mb-4"
            >
                <span className="mr-1">←</span> Back to Products
            </button>

            <GroupedProductDetails groupedProduct={groupedProduct} />
        </div>
    );
};

export default ProductDetailPage;