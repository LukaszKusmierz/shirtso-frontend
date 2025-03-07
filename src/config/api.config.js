const API_CONFIG = {
    // Base API URL - can be overridden with environment variable
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',

    // Authentication token storage key
    TOKEN_KEY: 'auth-token',

    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register'
        },
        PRODUCTS: {
            BASE: '/products',
            IN_STOCK: '/products/in-stock',
            NOT_IN_STOCK: '/products/not-in-stock',
            TOP_UP_STOCK: '/products/top-up-stock'
        },
        CATEGORIES: {
            BASE: '/categories',
            WITH_SUBCATEGORIES: '/categories/subcategories'
        },
        SUBCATEGORIES: {
            BASE: '/subcategories'
        }
    }
};

export default API_CONFIG;
