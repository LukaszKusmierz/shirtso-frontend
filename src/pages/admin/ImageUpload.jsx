import React, { useState, useRef } from 'react';
import axios from '../../api/axios';

const ImageUpload = ({ onImageUploaded, initialImageId = null }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [imageId, setImageId] = useState(initialImageId);

    const fileInputRef = useRef(null);

    // Set up preview for existing image if imageId is provided
    React.useEffect(() => {
        if (initialImageId) {
            setImageId(initialImageId);
            // In a real application, you would use the actual image path
            setPreviewUrl(`/api/placeholder/${400}/${400}`);
        }
    }, [initialImageId]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPG, PNG, GIF, or WEBP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size should not exceed 5MB');
            return;
        }

        setSelectedFile(file);
        setUploadError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError('Please select a file to upload');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        // Create form data for file upload
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            // In a real application, this would be your actual image upload API endpoint
            // For demo, we'll simulate a successful upload after a delay

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    const newProgress = prev + 10;
                    if (newProgress >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return newProgress;
                });
            }, 300);

            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Simulate successful upload with a random image ID
            const mockImageId = Math.floor(Math.random() * 1000);
            setImageId(mockImageId);

            // Call the parent component callback with the new image ID
            if (onImageUploaded) {
                onImageUploaded(mockImageId);
            }

            // Clear the file selection and reset progress
            clearInterval(progressInterval);
            setUploading(false);
            setUploadProgress(100);

            // Keep the preview but clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setSelectedFile(null);

        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadError('Failed to upload image. Please try again.');
            setUploading(false);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        if (file) {
            // Create a synthetic event object with the file
            const syntheticEvent = { target: { files: [file] } };
            handleFileSelect(syntheticEvent);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageId(null);
        setUploadError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Notify parent component
        if (onImageUploaded) {
            onImageUploaded(null);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
            </label>

            <div
                className={`mt-1 border-2 border-dashed rounded-md ${
                    uploadError ? 'border-red-300' : 'border-gray-300'
                } px-6 pt-5 pb-6`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="space-y-4 text-center">
                    {!previewUrl ? (
                        <>
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileSelect}
                                        ref={fileInputRef}
                                        accept="image/*"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                            </p>
                        </>
                    ) : (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Image preview"
                                className="mx-auto h-48 w-auto object-contain"
                            />

                            <div className="absolute top-0 right-0">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {imageId && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Image ID: {imageId}
                                </p>
                            )}
                        </div>
                    )}

                    {uploadError && (
                        <p className="text-sm text-red-600">{uploadError}</p>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>

            {selectedFile && !imageId && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            uploading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;

// Usage example in ProductForm.jsx
// Add this import at the top:
// import ImageUpload from '../components/admin/ImageUpload';

// Then in the form:
/*
  const handleImageUploaded = (imageId) => {
    setFormData(prev => ({
      ...prev,
      imageId: imageId ? imageId.toString() : ''
    }));
  };

  // Then in your JSX, add this component:
  <ImageUpload
    onImageUploaded={handleImageUploaded}
    initialImageId={formData.imageId ? parseInt(formData.imageId) : null}
  />
*/