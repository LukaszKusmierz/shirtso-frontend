import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, getPlaceholderUrl } from '../../utils/Helpers';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const { cartItemId, product, quantity, totalAmount } = item;
    const { productId, productName, price, currency, images } = product;

    const hasPrimaryImage = images && images.length > 0;
    const primaryImage = hasPrimaryImage
        ? images.find(img => img.isPrimary) || images[0]
        : null;

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        onUpdateQuantity(cartItemId, newQuantity);
    };

    return (
        <div className="flex items-center py-4 border-b">
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {primaryImage ? (
                    <img
                        src={getImageUrl(primaryImage.imageUrl)}
                        alt={primaryImage.altText || productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = getPlaceholderUrl();
                        }}
                    />
                ) : (
                    <img
                        src={getPlaceholderUrl()}
                        alt={productName}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex-grow ml-4">
                <Link to={`/products/${productId}`} className="text-lg font-semibold hover:text-blue-600">
                    {productName}
                </Link>
                <div className="text-gray-600 mt-1">
                    Price: {price} {currency}
                </div>
                <div className="text-gray-600">
                    Total: {totalAmount} {currency}
                </div>
            </div>

            <div className="flex items-center">
                <div className="flex items-center border rounded">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                        -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={() => onRemove(cartItemId)}
                    className="ml-4 text-red-600 hover:text-red-800"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;
