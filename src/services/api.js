import axios from 'axios';
import config from "../config";

const API_URL = config.apiUrl

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error:")
        Promise.reject(error)
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            console.error('Response error:', error.response.status, error.response.data);

            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }

            return Promise.reject({
                status: error.response.status,
                message: error.response.data?.info || error.response.data?.message || 'Server error',
                data: error.response.data
            });

        } else if (error.request) {
            console.error('Network error:', error.request);
            return Promise.reject({
                status: 0,
                message: 'Network error. Please check your connection and try again.'
            });

        } else {
            console.error('Request setup error:', error.message);
            return Promise.reject({
                status: 0,
                message: error.message || 'An unexpected error occurred'
            });
        }
    }
);

export default api;