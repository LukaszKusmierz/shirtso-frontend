import React from 'react';
import { Link } from 'react-router-dom';
import { getStockStatusColor, getImageUrl, getPlaceholderUrl } from "../../utils/Helpers";

const GroupedProductCard = ({ product }) => {
    const {
        productName,
        description,
        price,
        currency,
        totalStock,
        availableSizes,
        sizeVariants,
        images
    } = product;

    const hasImages = Array.isArray(images) && images.length > 0;
    const primaryImage = hasImages
        ? images.find(img => img.isPrimary) || images[0]
        : null;

    const defaultVariant = sizeVariants.find(v => v.stock > 0) || sizeVariants[0];
    const productLink = defaultVariant ? `/products/${defaultVariant.productId}` : '#';

    const priceDisplay = `${price} ${currency}`;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-105">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {primaryImage ? (
                    <img
                        src={getImageUrl(primaryImage.imageUrl)}
                        alt={primaryImage.altText || productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            if (!e.target.classList.contains('error-image')) {
                                console.error(`Failed to load image: ${e.target.src}`);
                                e.target.src = getPlaceholderUrl();
                                e.target.classList.add('error-image');
                            }
                        }}
                    />
                ) : (
                    <img src={getPlaceholderUrl()} alt="Product unavailable" />
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{productName}</h3>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">{description}</p>

                <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg">
                        {priceDisplay}
                    </span>
                    <div className="text-sm text-gray-600">
                        {sizeVariants.length} {sizeVariants.length === 1 ? 'size' : 'sizes'}
                    </div>
                </div>

                {/* Available sizes */}
                <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                        {availableSizes.map((size) => {
                            const variant = sizeVariants.find(v => v.size === size);
                            const isInStock = variant && variant.stock > 0;
                            return (
                                <span
                                    key={size}
                                    className={`text-xs px-2 py-1 rounded border ${
                                        isInStock
                                            ? 'border-blue-500 text-blue-700 bg-blue-50'
                                            : 'border-gray-300 text-gray-400 bg-gray-50'
                                    }`}
                                    title={isInStock ? `${variant.stock} in stock` : 'Out of stock'}
                                >
                                    {size}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusColor(totalStock)}`}>
                        {totalStock === 0 ? 'Out of stock' : `${totalStock} in stock`}
                    </span>

                    <Link
                        to={productLink}
                        state={{ groupedProduct: product }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GroupedProductCard;