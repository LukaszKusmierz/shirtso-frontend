import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { addToCart } from '../../services/CartService';
import {getImageUrl, getPlaceholderUrl, getStockStatusColor} from '../../utils/Helpers';
import Alert from '../common/Alert';
import Button from '../common/Button';

const GroupedProductDetails = ({ groupedProduct }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const {
        productName,
        description,
        price,
        currency,
        supplier,
        images = [],
        sizeVariants = [],
        availableSizes = [],
        totalStock
    } = groupedProduct;

    useEffect(() => {
        const defaultVariant = sizeVariants.find(v => v.stock > 0) || sizeVariants[0];
        if (defaultVariant) {
            setSelectedSize(defaultVariant.size);
            setSelectedVariant(defaultVariant);
        }
    }, [sizeVariants]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        const variant = sizeVariants.find(v => v.size === size);
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleAddToCart = async () => {
        if (!currentUser) {
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        if (!selectedVariant) {
            setError('Please select a size');
            return;
        }

        if (quantity < 1 || quantity > selectedVariant.stock) {
            setError('Please select a valid quantity.');
            return;
        }

        setAddingToCart(true);
        setError(null);

        try {
            await addToCart(selectedVariant.productId, quantity);
            setSuccessMessage(`Added ${quantity} ${productName} (Size: ${selectedSize}) to cart!`);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            console.error('Failed to add to cart:', err);
            setError('Failed to add item to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleImageError = (index) => {
        setImagesLoaded(prev => ({
            ...prev,
            [index]: false
        }));
    };

    const hasImages = Array.isArray(images) && images.length > 0;
    const sortedImages = hasImages
        ? [...images].sort((a, b) => a.displayOrder - b.displayOrder)
        : [];

    const primaryImageIndex = sortedImages.findIndex(img => img.isPrimary);
    useEffect(() => {
        if (primaryImageIndex >= 0) {
            setSelectedImageIndex(primaryImageIndex);
        }
    }, [primaryImageIndex]);

    const currentStock = selectedVariant?.stock || 0;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="m-4"
                />
            )}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    dismissible={true}
                    onDismiss={() => setSuccessMessage(null)}
                    className="m-4"
                />
            )}

            <div className="md:flex">
                {/* Image Gallery */}
                <div className="md:w-1/2">
                    <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {hasImages && sortedImages.length > 0 && imagesLoaded[selectedImageIndex] !== false ? (
                            <img
                                src={getImageUrl(sortedImages[selectedImageIndex].imageUrl)}
                                alt={sortedImages[selectedImageIndex].altText || productName}
                                className="w-full h-full object-contain"
                                onError={() => handleImageError(selectedImageIndex)}
                            />
                        ) : (
                            <img
                                src={getPlaceholderUrl()}
                                alt="Product placeholder"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    {/* Thumbnail images */}
                    {hasImages && sortedImages.length > 1 && (
                        <div className="flex overflow-x-auto p-2 space-x-2">
                            {sortedImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`h-16 w-16 flex-shrink-0 cursor-pointer border-2 ${
                                        index === selectedImageIndex ? 'border-blue-500' : 'border-transparent'
                                    }`}
                                    onClick={() => handleImageClick(index)}
                                >
                                    <img
                                        src={getImageUrl(image.imageUrl)}
                                        alt={image.altText || `Product view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = getPlaceholderUrl();
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 p-6">
                    <h1 className="text-2xl font-bold mb-2">{productName}</h1>

                    <div className="flex items-center mb-4">
                        <span className="text-xl font-semibold">
                            {price} {currency}
                        </span>
                        {sizeVariants.length > 1 && (
                            <span className="ml-2 text-sm text-gray-500">
                                ({sizeVariants.length} sizes available)
                            </span>
                        )}
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="text-gray-700">{description}</p>
                    </div>

                    {/* Size Selection */}
                    {availableSizes.length > 1 ? (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Select Size</h2>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((size) => {
                                    const variant = sizeVariants.find(v => v.size === size);
                                    const isInStock = variant && variant.stock > 0;
                                    const isSelected = selectedSize === size;

                                    return (
                                        <button
                                            key={size}
                                            onClick={() => isInStock && handleSizeChange(size)}
                                            disabled={!isInStock}
                                            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                    : isInStock
                                                        ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                            }`}
                                            title={isInStock ? `${variant.stock} in stock` : 'Out of stock'}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm">
                                Size: {availableSizes[0] || 'One Size'}
                            </span>
                        </div>
                    )}

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Details</h2>
                        <ul className="text-gray-700">
                            <li><span className="font-medium">Supplier:</span> {supplier}</li>
                            <li>
                                <span className="font-medium">Available Stock:</span>{' '}
                                <span className={`${getStockStatusColor(currentStock)}`}>
                                    {currentStock}
                                </span>
                            </li>
                            <li>
                                <span className="font-medium">Total Stock (all sizes):</span>{' '}
                                <span className="text-gray-600">{totalStock}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Add to Cart Section */}
                    {currentStock > 0 && selectedVariant ? (
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <label className="mr-4 font-medium">Quantity:</label>
                                <div className="flex items-center">
                                    <button
                                        className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={currentStock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.min(currentStock, Math.max(1, parseInt(e.target.value) || 1)))}
                                        className="w-12 h-8 text-center border-t border-b border-gray-300"
                                    />
                                    <button
                                        className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                variant="primary"
                                fullWidth={true}
                                disabled={addingToCart || !selectedSize}
                                loading={addingToCart}
                            >
                                {!selectedSize ? 'Select a Size' : 'Add to Cart'}
                            </Button>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <p className="text-red-600 mb-4">
                                {!selectedSize
                                    ? 'Please select a size'
                                    : 'This size is currently out of stock.'}
                            </p>
                            <Button
                                variant="secondary"
                                fullWidth={true}
                                disabled={true}
                            >
                                Out of Stock
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupedProductDetails;