import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { addToCart } from '../../services/CartService';
import { getImageUrl, getPlaceholderUrl } from '../../utils/Helpers';
import Alert from '../common/Alert';
import Button from '../common/Button';

const ProductDetails = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const images = product && (
        Array.isArray(product.images) ? product.images :
            Array.isArray(product.imageMappings) ? product.imageMappings :
                []
    );
    const hasImages = Array.isArray(images) && images.length > 0;
    const sortedImages = hasImages
        ? [...images].sort((a, b) => a.displayOrder - b.displayOrder)
        : [];
    const primaryImageIndex = hasImages
        ? sortedImages.findIndex(image => image.isPrimary)
        : -1;

    useEffect(() => {
        if (!product) return;

        if (primaryImageIndex >= 0) {
            setSelectedImageIndex(primaryImageIndex);
        } else if (sortedImages.length > 0) {
            setSelectedImageIndex(0);
        }
    }, [product, primaryImageIndex, sortedImages.length]);
    const handleAddToCart = async () => {
        if (!currentUser) {
            navigate('/login', { state: { from: `/products/${product.productId}` } });
            return;
        }

        if (quantity < 1 || quantity > product.stock) {
            setError('Please select a valid quantity.');
            return;
        }
        setAddingToCart(true);
        setError(null);

        try {
            await addToCart(product.productId, quantity);
            setSuccessMessage(`Added ${quantity} ${product.productName} to cart!`);
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
                            <li>
                                <span className="font-medium">Available Stock:</span>{' '}
                                <span className={stock === 0 ? 'text-red-600' : stock < 5 ? 'text-orange-600' : 'text-green-600'}>
                                    {stock}
                                </span>
                            </li>
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
                                        onChange={(e) => setQuantity(Math.min(stock, Math.max(1, parseInt(e.target.value) || 1)))}
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

                            <Button
                                onClick={handleAddToCart}
                                variant="primary"
                                fullWidth={true}
                                disabled={addingToCart}
                                loading={addingToCart}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <p className="text-red-600 mb-4">This product is currently out of stock.</p>
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

export default ProductDetails;
