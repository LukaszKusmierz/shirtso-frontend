import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import {
    getProductImages,
    getProductWithImages
} from '../../services/ProductService';
import {
    createImage,
    associateImageWithProduct,
    setPrimaryImage,
    removeImageFromProduct
} from '../../services/ImageService';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Button from '../common/Button';
import { getImageUrl, getPlaceholderUrl } from '../../utils/Helpers';

const GroupedProductImageManagement = () => {
    const { id } = useParams();
    const location = useLocation();
    const [groupedProduct, setGroupedProduct] = useState(location.state?.groupedProduct || null);
    const [productImages, setProductImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageAlt, setNewImageAlt] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [isPrimary, setIsPrimary] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || !currentUser.roles || !currentUser.roles.includes('USER_WRITE')) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // If we don't have grouped product from state, fetch it
                if (!groupedProduct && id) {
                    const productData = await getProductWithImages(id);
                    setGroupedProduct(productData);
                }

                // Fetch images for the first variant (they should be the same for all)
                const variantId = groupedProduct?.sizeVariants?.[0]?.productId || id;
                const imagesData = await getProductImages(variantId);
                setProductImages(imagesData);

                setError(null);
            } catch (err) {
                setError('Failed to load data: ' + (err.message || 'Unknown error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, groupedProduct]);

    const handleCreateImage = async (e) => {
        e.preventDefault();

        if (!newImageUrl.trim()) {
            setError('Image URL is required');
            return;
        }

        try {
            setLoading(true);

            const imageData = {
                imageUrl: newImageUrl.trim(),
                altText: newImageAlt.trim() || null
            };
            const newImage = await createImage(imageData);

            setSelectedImage(newImage.imageId);
            setNewImageUrl('');
            setNewImageAlt('');
            setSuccessMessage('Image created successfully! Now associate it with the product.');
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            setError('Failed to create image: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssociateImage = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            setError('Please select or create an image first');
            return;
        }

        if (!groupedProduct?.sizeVariants || groupedProduct.sizeVariants.length === 0) {
            setError('No product variants found');
            return;
        }

        try {
            setLoading(true);
            const imageData = {
                imageId: parseInt(selectedImage),
                isPrimary: isPrimary,
                displayOrder: parseInt(displayOrder) || 0
            };

            // Associate image with ALL variants in the group
            const associationPromises = groupedProduct.sizeVariants.map(variant =>
                associateImageWithProduct(variant.productId, imageData)
            );

            await Promise.all(associationPromises);

            // Refresh images
            const variantId = groupedProduct.sizeVariants[0].productId;
            const updatedImages = await getProductImages(variantId);
            setProductImages(updatedImages);

            setSelectedImage(null);
            setDisplayOrder(0);
            setIsPrimary(false);
            setSuccessMessage('Image associated with all product variants successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Failed to associate image: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimary = async (imageId) => {
        if (!groupedProduct?.sizeVariants || groupedProduct.sizeVariants.length === 0) {
            setError('No product variants found');
            return;
        }

        try {
            setLoading(true);

            // Set as primary for ALL variants in the group
            const updatePromises = groupedProduct.sizeVariants.map(variant =>
                setPrimaryImage(variant.productId, imageId)
            );

            await Promise.all(updatePromises);

            // Refresh images
            const variantId = groupedProduct.sizeVariants[0].productId;
            const updatedImages = await getProductImages(variantId);
            setProductImages(updatedImages);

            setSuccessMessage('Primary image updated for all variants successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Failed to update primary image: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to remove this image from all product variants?')) {
            return;
        }

        if (!groupedProduct?.sizeVariants || groupedProduct.sizeVariants.length === 0) {
            setError('No product variants found');
            return;
        }

        try {
            setLoading(true);

            // Remove image from ALL variants in the group
            const removePromises = groupedProduct.sizeVariants.map(variant =>
                removeImageFromProduct(variant.productId, imageId).catch(err => {
                    console.warn(`Failed to remove image from variant ${variant.productId}:`, err);
                    return null;
                })
            );

            await Promise.all(removePromises);

            // Refresh images
            const variantId = groupedProduct.sizeVariants[0].productId;
            const updatedImages = await getProductImages(variantId);
            setProductImages(updatedImages);

            setSuccessMessage('Image removed from all variants successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            setError('Failed to remove image: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/admin/products');
    };

    if (loading && !groupedProduct) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!groupedProduct) {
        return (
            <div className="container mx-auto p-4">
                <Alert
                    type="error"
                    message="Product not found"
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

            <h1 className="text-2xl font-bold mb-2">Image Management for {groupedProduct.productName}</h1>
            <p className="text-gray-600 mb-6">
                Images will be applied to all {groupedProduct.sizeVariants?.length || 0} size variants:
                {groupedProduct.availableSizes?.join(', ')}
            </p>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    dismissible={true}
                    onDismiss={() => setSuccessMessage(null)}
                    className="mb-4"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Product Images */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Current Images</h2>

                    {productImages.length === 0 ? (
                        <p className="text-gray-500">No images associated with this product group</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {productImages.map((image) => (
                                <div key={image.imageId} className="border rounded-lg overflow-hidden">
                                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={getImageUrl(image.imageUrl)}
                                            alt={image.altText || groupedProduct.productName}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                e.target.src = getPlaceholderUrl();
                                            }}
                                        />
                                    </div>
                                    <div className="p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">ID: {image.imageId}</span>
                                            {image.isPrimary && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Order: {image.displayOrder}
                                        </p>
                                        {image.altText && (
                                            <p className="text-xs text-gray-500 mb-2 truncate">
                                                Alt: {image.altText}
                                            </p>
                                        )}
                                        <div className="flex space-x-2">
                                            {!image.isPrimary && (
                                                <button
                                                    onClick={() => handleSetPrimary(image.imageId)}
                                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                    disabled={loading}
                                                >
                                                    Set Primary
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemoveImage(image.imageId)}
                                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                disabled={loading}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Images Section */}
                <div>
                    {/* Create New Image */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">Create & Add New Image</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This will add the image to all {groupedProduct.sizeVariants?.length || 0} variants of this product.
                        </p>

                        <form onSubmit={handleCreateImage}>
                            <div className="mb-4">
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL *
                                </label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="https://example.com/image.jpg or /static/products/image.jpg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-1">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    id="imageAlt"
                                    value={newImageAlt}
                                    onChange={(e) => setNewImageAlt(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Description of the image"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || !newImageUrl.trim()}
                                loading={loading}
                            >
                                Create Image
                            </Button>
                        </form>
                    </div>

                    {/* Associate Image Form */}
                    {selectedImage && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Associate Image with Product</h2>

                            <form onSubmit={handleAssociateImage}>
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                    <p className="text-sm text-blue-800">
                                        Selected Image ID: <strong>{selectedImage}</strong>
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        id="displayOrder"
                                        value={displayOrder}
                                        onChange={(e) => setDisplayOrder(e.target.value)}
                                        min="0"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isPrimary"
                                            checked={isPrimary}
                                            onChange={(e) => setIsPrimary(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700">
                                            Set as primary image
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    Add to All Variants
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Variants Info */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {groupedProduct.sizeVariants?.map((variant) => (
                        <div
                            key={variant.productId}
                            className="border rounded p-3 text-center"
                        >
                            <div className="font-semibold text-lg">{variant.size}</div>
                            <div className="text-sm text-gray-600">ID: {variant.productId}</div>
                            <div className={`text-sm mt-1 ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Stock: {variant.stock}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupedProductImageManagement;