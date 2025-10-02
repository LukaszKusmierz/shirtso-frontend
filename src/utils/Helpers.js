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

export const groupProducts = (products) => {
    const groups = {};

    products.forEach(product => {
        // Create a unique key for each product group
        const key = `${product.productName}-${product.description}-${product.supplier}`;

        if (!groups[key]) {
            groups[key] = {
                groupId: key,
                productName: product.productName,
                description: product.description,
                supplier: product.supplier,
                currency: product.currency,
                variants: [],
                images: product.images || [],
                minPrice: product.price,
                maxPrice: product.price,
                totalStock: 0,
                availableSizes: []
            };
        }

        groups[key].variants.push({
            productId: product.productId,
            size: product.size,
            price: product.price,
            stock: product.stock,
            currency: product.currency,
            subcategoryId: product.subcategoryId
        });

        groups[key].minPrice = Math.min(groups[key].minPrice, product.price);
        groups[key].maxPrice = Math.max(groups[key].maxPrice, product.price);
        groups[key].totalStock += product.stock;

        if (!groups[key].availableSizes.includes(product.size)) {
            groups[key].availableSizes.push(product.size);
        }

        if ((!groups[key].images || groups[key].images.length === 0) &&
            product.images && product.images.length > 0) {
            groups[key].images = product.images;
        }
    });

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    return Object.values(groups).map(group => ({
        ...group,
        variants: group.variants.sort((a, b) =>
            sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
        ),
        availableSizes: group.availableSizes.sort((a, b) =>
            sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
        )
    }));
};

export const getDefaultVariant = (productGroup) => {
    if (!productGroup || !productGroup.variants || productGroup.variants.length === 0) {
        return null;
    }

    const inStockVariant = productGroup.variants.find(v => v.stock > 0);
    return inStockVariant || productGroup.variants[0];
};

export const getVariantBySize = (productGroup, size) => {
    if (!productGroup || !productGroup.variants) {
        return null;
    }
    return productGroup.variants.find(v => v.size === size);
};

export const formatPriceRange = (minPrice, maxPrice, currency) => {
    if (minPrice === maxPrice) {
        return `${minPrice} ${currency}`;
    }
    return `${minPrice} - ${maxPrice} ${currency}`;
};
