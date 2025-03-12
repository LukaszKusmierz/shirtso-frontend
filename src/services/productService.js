import api from './api.js';

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

export const addNewProduct = (productData) => {
    const transformedData = {
        productName: productData.productName,
        description: productData.description,
        price: productData.price,
        currency: productData.currency,
        imageId: productData.imageId || 0,
        subcategoryId: productData.subcategoryId,
        supplier: productData.supplier,
        stock: productData.stock,
        size: productData.size
    };

    return api.post('/products', transformedData);
};
