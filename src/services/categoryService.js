import api from './api.js';

export const getAllCategories = () => {
    return api.get('/categories');
};

export const getAllCategoriesWithSubcategories = () => {
    return api.get('/categories/subcategories');
};

export const getSubcategoriesByCategory = (categoryId) => {
    return api.get(`/subcategories/${categoryId}`);
};