import axios from "axios";

export const categoryService = {
    getAllCategories: async () => {
        return await axios.get('/categories');
    },

    getCategoriesWithSubcategories: async () => {
        return await axios.get('/categories/subcategories');
    },

    getSubcategoriesByCategory: async (categoryId) => {
        return await axios.get(`/subcategories/${categoryId}`);
    }
};
