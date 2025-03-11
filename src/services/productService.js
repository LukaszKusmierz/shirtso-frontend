import api from './api.js';

export const getAllProducts = () => {
    return api.get('/products');
};

export const getProductsBySubcategory = (subcategoryId) => {
    return api.get(`/products?subcategoryId=${subcategoryId}`);
};

export const getProductsBySize = (size) => {
    return api.get(`/products?size=${size}`);
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

export const addNewProduct = (productData) => {
    return api.post('/products', productData);
};
