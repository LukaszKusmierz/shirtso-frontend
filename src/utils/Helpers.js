export const getStockStatusColor = (stock) => {
    if (stock > 0 && stock <= 3) return 'text-red-500 font-medium';
    if (stock > 3 && stock < 10) return 'text-yellow-500 font-medium';
    return 'text-green-500 font-medium';
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

export const getPlaceholderUrl = () => "/placeholder-product.png";

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

