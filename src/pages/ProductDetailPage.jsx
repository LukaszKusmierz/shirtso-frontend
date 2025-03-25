import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetails from '../components/products/ProductDetails';
import { getProductWithImages } from '../services/productService';
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const productWithImages = await getProductWithImages(id);
                setProduct(productWithImages);

            } catch (err) {
                setError('Failed to load product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Alert
                    type="error"
                    title="Error"
                    message={error}
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

            <ProductDetails product={product} />
        </div>
    );
};

export default ProductDetailPage;