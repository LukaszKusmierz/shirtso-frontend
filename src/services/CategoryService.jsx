import api from './Api.jsx';

export const getAllCategories = () => {
    return api.get('/categories');
};

export const getAllCategoriesWithSubcategories = () => {
    return api.get('/categories/subcategories');
};

export const getSubcategoriesByCategory = (categoryId) => {
    return api.get(`/subcategories/${categoryId}`);
};

export const getAllSizes = () => {
    return api.get('/size');
}
