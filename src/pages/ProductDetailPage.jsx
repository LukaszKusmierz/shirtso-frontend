import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetails from '../components/products/ProductDetails';
import { getAllProducts } from '../services/productService';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                // In a real app, you would have a dedicated API endpoint to get a product by ID
                // For now, we'll get all products and find the one with matching ID
                const products = await getAllProducts();
                const foundProduct = products.find((p) => p.productId === id);

                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
                <Link to="/products" className="text-blue-600 hover:underline">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Link to="/products" className="text-blue-600 hover:underline block mb-4">
                ← Back to Products
            </Link>

            <ProductDetails product={product} />
        </div>
    );
};

export default ProductDetailPage;