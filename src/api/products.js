import axios from "axios";

export const productService = {
    getAllProducts: async (page = 0, size = 10) => {
        return await axios.get(`/products?page=${page}&size=${size}`);
    },

    getProductsByCategory: async (subcategoryId) => {
        return await axios.get(`/products?subcategoryId=${subcategoryId}`);
    },

    getProductsBySize: async (size) => {
        return await axios.get(`/products?size=${size}`);
    },

    getProductsByName: async (productName) => {
        return await axios.get(`/products?productName=${productName}`);
    },

    getProductsInStock: async () => {
        return await axios.get('/products/in-stock');
    },

    getProductsNotInStock: async () => {
        return await axios.get('/products/not-in-stock');
    },

    getProductsTopUpStock: async () => {
        return await axios.get('/products/top-up-stock');
    },

    addProduct: async (productData) => {
        return await axios.post('/products', productData);
    }
};
