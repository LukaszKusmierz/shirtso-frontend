import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductDetails from '../components/products/ProductDetails';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // This endpoint is inferred - you may need to adjust based on your API
                const response = await axios.get(`/products/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details. Please try again later.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-100 text-red-700 p-4 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
                    <p>Product not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <ProductDetails product={product} />
        </div>
    );
};

export default ProductDetailPage;
