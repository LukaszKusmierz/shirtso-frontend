import React, { useState, useEffect } from 'react';
import { searchPhotos, getRandomPhoto, downloadPhoto } from '../../services/UnsplashService';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

const UnsplashImagePicker = ({ onImageSelect, onCancel, searchQuery = '' }) => {
    const [photos, setPhotos] = useState([]);
    const [query, setQuery] = useState(searchQuery);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery);
        } else {
            loadRandomPhotos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadRandomPhotos = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load multiple random photos
            const randomPhotos = await Promise.all(
                Array(10).fill(null).map(() => getRandomPhoto('product'))
            );
            setPhotos(randomPhotos);
        } catch (err) {
            console.error('Failed to load random photos:', err);
            setError('Failed to load photos from Unsplash');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (searchQuery = query, pageNum = 1) => {
        if (!searchQuery.trim()) {
            setError('Please enter a search query');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await searchPhotos(searchQuery, pageNum, 12);
            console.log('Search result:', result); // Debug log

            // Handle different response structures
            if (result && Array.isArray(result.results)) {
                setPhotos(result.results);
                setTotalPages(result.totalPages || 0);
            } else if (Array.isArray(result)) {
                // If result is directly an array
                setPhotos(result);
                setTotalPages(1);
            } else {
                console.error('Unexpected response structure:', result);
                setError('Received unexpected response format from server');
                setPhotos([]);
                setTotalPages(0);
            }
            setPage(pageNum);
        } catch (err) {
            console.error('Failed to search photos:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to search photos on Unsplash';
            setError(errorMessage);
            setPhotos([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const handleSelectImage = async () => {
        if (!selectedPhoto) {
            setError('Please select a photo');
            return;
        }

        try {
            // Trigger download tracking on Unsplash
            await downloadPhoto(selectedPhoto.id);

            // Return the selected photo data to parent
            onImageSelect({
                imageUrl: selectedPhoto.urls.regular,
                altText: selectedPhoto.alt_description || selectedPhoto.description || 'Product image from Unsplash',
                photographerName: selectedPhoto.user.name,
                photographerUsername: selectedPhoto.user.username,
                photographerUrl: selectedPhoto.user.links.html,
                unsplashUrl: selectedPhoto.links.html
            });
        } catch (err) {
            console.error('Failed to process photo selection:', err);
            setError('Failed to select photo');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(query, 1);
    };

    return (
        <div className="bg-white rounded-lg p-6 border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Image from Unsplash</h3>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for photos (e.g., 'shirt', 'product', 'clothing')"
                        className="flex-grow p-2 border border-gray-300 rounded"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !query.trim()}
                    >
                        Search
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={loadRandomPhotos}
                        disabled={loading}
                    >
                        Random
                    </Button>
                </div>
            </form>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                </div>
            )}

            {/* Photos Grid */}
            {!loading && photos.length > 0 && (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => handlePhotoClick(photo)}
                                className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                                    selectedPhoto?.id === photo.id
                                        ? 'border-blue-500 ring-2 ring-blue-300'
                                        : 'border-transparent hover:border-gray-300'
                                }`}
                            >
                                <div className="aspect-square bg-gray-100">
                                    <img
                                        src={photo.urls.small}
                                        alt={photo.alt_description || 'Unsplash photo'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-2 bg-gray-50">
                                    <p className="text-xs text-gray-600 truncate">
                                        by {photo.user.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleSearch(query, page - 1)}
                                disabled={page <= 1 || loading}
                            >
                                Previous
                            </Button>
                            <span className="px-4 py-2">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => handleSearch(query, page + 1)}
                                disabled={page >= totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* No Results */}
            {!loading && photos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No photos found. Try a different search term.
                </div>
            )}

            {/* Selected Photo Details */}
            {selectedPhoto && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-semibold mb-2">Selected Photo</h4>
                    <div className="flex items-start gap-4">
                        <img
                            src={selectedPhoto.urls.thumb}
                            alt={selectedPhoto.alt_description || 'Selected photo'}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-grow text-sm">
                            <p className="mb-1">
                                <strong>Photographer:</strong>{' '}
                                <a
                                    href={selectedPhoto.user.links.html}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {selectedPhoto.user.name}
                                </a>
                            </p>
                            {selectedPhoto.description && (
                                <p className="mb-1">
                                    <strong>Description:</strong> {selectedPhoto.description}
                                </p>
                            )}
                            <p className="text-xs text-gray-600 mt-2">
                                Photo will be credited according to Unsplash License
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={handleSelectImage}
                    disabled={!selectedPhoto}
                >
                    Use Selected Image
                </Button>
            </div>

            {/* Unsplash Attribution */}
            <div className="mt-4 pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                    Photos provided by{' '}
                    <a
                        href="https://unsplash.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Unsplash
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UnsplashImagePicker;




