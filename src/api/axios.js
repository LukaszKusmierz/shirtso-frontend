import axios from "axios";
import API_CONFIG from "../config/api.config";

/**
 * Axios instance with default configuration
 */
const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

/**
 * Request interceptor - handles authorization headers and request setup
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - handles successful responses and errors
 */
axiosInstance.interceptors.response.use(
    (response) => {
        // Return the actual data from the response
        return response.data;
    },
    (error) => {
        // Enhanced error handling based on status codes
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            const { status, data } = error.response;

            switch (status) {
                case 401: // Unauthorized
                    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
                    // Only redirect if not already on the login page
                    if (!window.location.pathname.includes(API_CONFIG.ENDPOINTS.AUTH.LOGIN)) {
                        window.location.href = API_CONFIG.ENDPOINTS.AUTH.LOGIN;
                    }
                    console.error("Authentication error:", data);
                    break;

                case 403: // Forbidden
                    console.error("Permission denied:", data);
                    break;

                case 404: // Not found
                    console.error("Resource not found:", data);
                    break;

                case 422: // Validation error
                    console.error("Validation error:", data);
                    break;

                case 500: // Server error
                case 502: // Bad gateway
                case 503: // Service unavailable
                    console.error("Server error:", data);
                    break;

                default:
                    console.error(`API Error (${status}):`, data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from server:", error.request);
        } else {
            // Something happened in setting up the request
            console.error("Request configuration error:", error.message);
        }

        // Continue with the error chain
        return Promise.reject(error);
    }
);

export default axiosInstance;
