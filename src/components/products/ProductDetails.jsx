import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProductDetails = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (!product) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    const {
        productName,
        description,
        price,
        currency,
        size,
        stock,
        supplier,
    } = product;

    const handleAddToCart = () => {
        // In a real app, you would implement cart functionality
        // For now, we'll just show an alert
        if (!currentUser) {
            navigate('/login');
            return;
        }

        alert(`Added ${quantity} ${productName} to cart`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-6xl">
              <i className="fas fa-tshirt"></i>
            </span>
                    </div>
                </div>

                <div className="md:w-1/2 p-6">
                    <h1 className="text-2xl font-bold mb-2">{productName}</h1>

                    <div className="flex items-center mb-4">
            <span className="text-xl font-semibold">
              {price} {currency}
            </span>
                        <span className="ml-4 px-2 py-1 bg-gray-100 rounded-lg text-sm">
              Size: {size}
            </span>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="text-gray-700">{description}</p>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Details</h2>
                        <ul className="text-gray-700">
                            <li><span className="font-medium">Supplier:</span> {supplier}</li>
                            <li><span className="font-medium">Available Stock:</span> {stock}</li>
                        </ul>
                    </div>

                    {stock > 0 ? (
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <label className="mr-4 font-medium">Quantity:</label>
                                <div className="flex items-center">
                                    <button
                                        className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.min(stock, Math.max(1, parseInt(e.target.value))))}
                                        className="w-12 h-8 text-center border-t border-b border-gray-300"
                                    />
                                    <button
                                        className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center"
                                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <p className="text-red-600 mb-4">This product is currently out of stock.</p>
                            <button
                                className="w-full py-2 px-4 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                                disabled
                            >
                                Out of Stock
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;