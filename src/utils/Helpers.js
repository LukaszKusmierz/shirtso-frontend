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
    let fullUrl;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    if (imagePath.startsWith('/')) {
        fullUrl = `${baseUrl}${imagePath}`;
    } else {
        fullUrl = `${baseUrl}/${imagePath}`;
    }

    console.log("Generated image URL:", fullUrl);
    return fullUrl;
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

export function formatMethodName(methodId) {
    return methodId
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}

export const validate = (formData, categoryId) => {
    let tempErrors = {};
    if (!formData.productName) tempErrors.productName = 'Product name is required';
    if (formData.productName && (formData.productName.length < 3 || formData.productName.length > 20))
        tempErrors.productName = 'Product name must be between 3 and 20 characters';

    if (!formData.description) tempErrors.description = 'Description is required';

    if (!formData.price) tempErrors.price = 'Price is required';
    if (formData.price && isNaN(parseFloat(formData.price)))
        tempErrors.price = 'Price must be a number';
    if (formData.price && parseFloat(formData.price) <= 0)
        tempErrors.price = 'Price must be greater than zero';

    if (!formData.currency) tempErrors.currency = 'Currency is required';

    if (!categoryId) tempErrors.categoryId = 'Category is required';
    if (!formData.subcategoryId) tempErrors.subcategoryId = 'Subcategory is required';

    if (!formData.supplier) tempErrors.supplier = 'Supplier is required';

    if (formData.stock === '' || isNaN(parseInt(formData.stock)))
        tempErrors.stock = 'Stock must be a number';

    if (!formData.size) tempErrors.size = 'Size is required';

    return Object.keys(tempErrors).length === 0;
};
