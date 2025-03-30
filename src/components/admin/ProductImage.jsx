import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import {
    getProductWithImages,
    getProductImages
} from '../../services/ProductService';
import {
    getAllImages,
    createImage,
    associateImageWithProduct,
    setPrimaryImage,
    removeImageFromProduct
} from '../../services/imageService';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Button from '../common/Button';
import { getImageUrl, getPlaceholderUrl } from '../../utils/Helpers';

const ProductImageManagement = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [allImages, setAllImages] = useState([]);
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

    // Check if user has admin role
    useEffect(() => {
        if (!currentUser || !currentUser.roles || !currentUser.roles.includes('USER_WRITE')) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // Fetch product and images data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productData, imagesData] = await Promise.all([
                    getProductWithImages(id),
                    getAllImages()
                ]);

                setProduct(productData);
                setAllImages(imagesData);

                // Refresh product images
                const productImagesData = await getProductImages(id);
                setProductImages(productImagesData);

                setError(null);
            } catch (err) {
                setError('Failed to load data: ' + (err.message || 'Unknown error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCreateImage = async (e) => {
        e.preventDefault();

        if (!newImageUrl.trim()) {
            setError('Image URL is required');
            return;
        }

        try {
            setLoading(true);

            // Create new image
            const imageData = {
                imageUrl: newImageUrl.trim(),
                altText: newImageAlt.trim() || null
            };

            const newImage = await createImage(imageData);

            // Update all images list
            setAllImages([...allImages, newImage]);

            // Select the new image
            setSelectedImage(newImage.imageId);

            // Clear form
            setNewImageUrl('');
            setNewImageAlt('');

            setSuccessMessage('Image created successfully!');
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
            setError('Please select an image');
            return;
        }

        try {
            setLoading(true);

            // Associate image with product
            const imageData = {
                imageId: parseInt(selectedImage),
                isPrimary: isPrimary,
                displayOrder: parseInt(displayOrder) || 0
            };

            await associateImageWithProduct(id, imageData);

            // Refresh product images
            const productImagesData = await getProductImages(id);
            setProductImages(productImagesData);

            // Reset form
            setSelectedImage(null);
            setDisplayOrder(0);
            setIsPrimary(false);

            setSuccessMessage('Image associated with product successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            setError('Failed to associate image: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimary = async (imageId) => {
        try {
            setLoading(true);

            await setPrimaryImage(id, imageId);

            // Refresh product images
            const productImagesData = await getProductImages(id);
            setProductImages(productImagesData);

            setSuccessMessage('Primary image updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (err) {
            setError('Failed to update primary image: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to remove this image from the product?')) {
            return;
        }

        try {
            setLoading(true);

            await removeImageFromProduct(id, imageId);

            // Refresh product images
            const productImagesData = await getProductImages(id);
            setProductImages(productImagesData);

            setSuccessMessage('Image removed from product successfully!');
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

    if (loading && !product) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!product) {
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

            <h1 className="text-2xl font-bold mb-6">Image Management for {product.productName}</h1>

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
                        <p className="text-gray-500">No images associated with this product</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {productImages.map((image) => (
                                <div key={image.imageId} className="border rounded-lg overflow-hidden">
                                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={getImageUrl(image.imageUrl)}
                                            alt={image.altText || product.productName}
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
                                        <div className="flex space-x-2">
                                            {!image.isPrimary && (
                                                <button
                                                    onClick={() => handleSetPrimary(image.imageId)}
                                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                    disabled={loading}
                                                >
                                                    Set as Primary
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
                        <h2 className="text-xl font-semibold mb-4">Create New Image</h2>

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

                    {/* Associate Existing Image */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Associate Existing Image</h2>

                        <form onSubmit={handleAssociateImage}>
                            <div className="mb-4">
                                <label htmlFor="selectedImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Image *
                                </label>
                                <select
                                    id="selectedImage"
                                    value={selectedImage || ''}
                                    onChange={(e) => setSelectedImage(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="">Select an Image</option>
                                    {allImages.map(image => (
                                        <option key={image.imageId} value={image.imageId}>
                                            ID: {image.imageId} - {image.altText || 'No alt text'}
                                        </option>
                                    ))}
                                </select>
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
                                disabled={loading || !selectedImage}
                                loading={loading}
                            >
                                Associate Image
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductImageManagement;
