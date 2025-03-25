export const formatPrice = (price, currency) => {
    return `${price} ${currency}`;
};

export const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of stock', color: 'red' };
    if (stock < 3) return { text: 'Low stock', color: 'orange' };
    return { text: 'In stock', color: 'green' };
};

export const getStockStatusColor = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return getPlaceholderUrl();
    const baseUrl = process.env.REACT_APP_STATIC_URL || '';
    if (imagePath.startsWith('/')) {
        return `${baseUrl}${imagePath}`;
    }
    return `${baseUrl}/${imagePath}`;
};

export const getPlaceholderUrl = () => {
    const baseUrl = process.env.REACT_APP_STATIC_URL || '';
    return `${baseUrl}/placeholder-product.png`;
};

export const getProductImages = (product) => {
    if (!product) return [];
    const images = product.images || product.imageMappings || [];
    return Array.isArray(images) ? images : [];
}

export const getPrimaryImage = (images) => {
    if (!Array.isArray(images) || images.length === 0) return null;
    return images.find(img => img.isPrimary) || images[0];
}

export const getSortedImages = (images) => {
    if (!Array.isArray(images) || images.length === 0) return [];
    return [...images].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}
