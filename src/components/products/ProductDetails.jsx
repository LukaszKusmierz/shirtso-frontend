import React, { useState } from 'react';
import useCart from '../../hooks/useCart';

const ProductDetails = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState(product.size);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const isInStock = product.stock > 0;

    const handleAddToCart = () => {
        addToCart({
            ...product,
            size: selectedSize
        }, quantity);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= product.stock) {
            setQuantity(value);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
                {/* Product Image */}
                <div className="md:w-1/2">
                    <img
                        src={`/api/placeholder/${600}/${600}`}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.productName}</h1>

                    <div className="flex items-center mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>

                        {isInStock && (
                            <span className="ml-2 text-sm text-gray-500">
                {product.stock} available
              </span>
                        )}
                    </div>

                    <p className="text-3xl font-bold text-gray-900 mb-6">
                        {product.price.toFixed(2)} {product.currency}
                    </p>

                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-2">Size</h2>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-3 py-1 text-sm border rounded ${
                                        selectedSize === size
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-2">Details</h2>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li><span className="font-medium">Supplier:</span> {product.supplier}</li>
                            <li><span className="font-medium">Subcategory ID:</span> {product.subcategoryId}</li>
                            <li><span className="font-medium">Product ID:</span> {product.productId}</li>
                        </ul>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="mt-8">
                        <div className="flex items-center mb-4">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-4">
                                Quantity
                            </label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    type="button"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-12 text-center border-none focus:ring-0"
                                />
                                <button
                                    type="button"
                                    onClick={incrementQuantity}
                                    disabled={quantity >= product.stock}
                                    className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isInStock}
                            className={`w-full py-3 px-4 rounded-md ${
                                isInStock
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isInStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
