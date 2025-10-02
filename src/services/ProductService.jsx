import api from './Api.jsx';

export const getAllProducts = () => {
    return api.get('/products');
};

export const getAllProductsPage = (page = 0, size = 10) => {
    return api.get(`/products?page=${page}&size=${size}`);
};

export const getProductsBySubcategory = (subcategoryId) => {
    return api.get(`/products?subcategoryId=${subcategoryId}`);
};

export const getProductsBySizeAndSubcategory = (size, subcategoryId) => {
    return api.get(`/products?size=${size}&subcategoryId=${subcategoryId}`);
};

export const getProductsBySizeAndCategory = (size, categoryId) => {
    return api.get(`/products?size=${size}&categoryId=${categoryId}`);
}

export const getProductsInStock = () => {
    return api.get('/products/in-stock');
};

export const getProductsNotInStock = () => {
    return api.get('/products/not-in-stock');
};

export const getProductsTopUpStock = () => {
    return api.get('/products/top-up-stock');
};

export const getProductsByName = (productName) => {
    return api.get(`/products?productName=${productName}`);
};

export const getSizes = () => {
    return api.get('/products/sizes');
}

export const getProductsBySize = (size) => {
    return api.get(`/products?size=${size}`);
};

export const getProductById = (productId) => {
    return api.get(`/products/${productId}`);
}

export const getProductImages = (productId) => {
    return api.get(`/products/${productId}/images`);
}

export const getProductsByCategoryId = (categoryId) => {
    return api.get(`/products?categoryId=${categoryId}`);
}

export const getProductWithImages = async (productId) => {
    try {
        const product = await getProductById(productId);
        const images = await getProductImages(productId);
        return {
            ...product,
            images: images,
            imageMappings: images
        };
    } catch (error) {
        console.error('Failed to fetch product with images:', error);
        throw error;
    }
}

export const addNewProduct = (productData) => {
    const transformedData = {
        productName: productData.productName,
        description: productData.description,
        price: productData.price,
        currency: productData.currency,
        subcategoryId: productData.subcategoryId,
        supplier: productData.supplier,
        stock: productData.stock,
        size: productData.size
    };

    return api.post('/products', transformedData);
};

export const updateProduct = (productId, productData) => {
    const transformedData = {
        productName: productData.productName,
        description: productData.description,
        price: productData.price,
        currency: productData.currency,
        subcategoryId: productData.subcategoryId,
        supplier: productData.supplier,
        stock: productData.stock,
        size: productData.size
    };

    return api.put(`/products/${productId}`, transformedData);
};

export const deleteProduct = (productId) => {
    return api.delete(`/products/${productId}`);
};

export const getAllGroupedProducts = () => {
    return api.get('/products/grouped');
};

export const getGroupedProductsByCategory = (categoryId) => {
    return api.get(`/products/grouped?categoryId=${categoryId}`);
};

export const getGroupedProductsBySubcategory = (subcategoryId) => {
    return api.get(`/products/grouped?subcategoryId=${subcategoryId}`);
};

export const getGroupedProductsBySize = (size) => {
    return api.get(`/products/grouped?size=${size}`);
};

export const getGroupedProductsBySizeAndCategory = (size, categoryId) => {
    return api.get(`/products/grouped?size=${size}&categoryId=${categoryId}`);
};

export const getGroupedProductsBySizeAndSubcategory = (size, subcategoryId) => {
    return api.get(`/products/grouped?size=${size}&subcategoryId=${subcategoryId}`);
};

export const getGroupedProductsInStock = () => {
    return api.get('/products/grouped/in-stock');
};

export const getGroupedProductsByName = (productName) => {
    return api.get(`/products/grouped?productName=${productName}`);
};

// Get a specific grouped product by any variant's productId
export const getGroupedProductByVariantId = (productId) => {
    return api.get(`/products/grouped/${productId}`);
};