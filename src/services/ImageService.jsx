import api from './Api.jsx';

export const getAllImages = () => {
    return api.get('/images');
};

export const getImageById = (imageId) => {
    return api.get(`/images/${imageId}`);
};

export const createImage = (imageData) => {
    return api.post('/images', imageData);
};

export const updateImage = (imageId, imageData) => {
    return api.put(`/images/${imageId}`, imageData);
};

export const deleteImage = (imageId) => {
    return api.delete(`/images/${imageId}`);
};

export const getProductsUsingImage = (imageId) => {
    return api.get(`/images/${imageId}/products`);
};

export const associateImageWithProduct = (productId, imageData) => {
    return api.post(`/products/${productId}/images`, imageData);
};

export const setPrimaryImage = (productId, imageId) => {
    return api.put(`/products/${productId}/images/primary/${imageId}`);
};

export const removeImageFromProduct = (productId, imageId) => {
    return api.delete(`/products/${productId}/images/${imageId}`);
};

export const getProductPrimaryImage = (productId) => {
    return api.get(`/products/${productId}/images/primary`);
};
