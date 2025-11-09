import api from './Api.jsx';
import {formatMethodName} from "../utils/Helpers";

export const processPayment = (paymentData) => {
    return api.post('/payments/process', paymentData);
};

// Example payment data structure:
// {
//   orderId: 123,
//   paymentMethod: "CREDIT_CARD",
//   cardNumber: "4111111111111111",
//   cardHolderName: "John Doe",
//   expiryDate: "12/24",
//   cvv: "123"
// }

// export const getPaymentMethods = async () => {
//     const response = await api.get('/payments/methods');
//     return response.data.map(methodId => ({
//         id: methodId,
//         name: formatMethodName(methodId)
//     }));

export const getPaymentMethods = async () => {
    try {
        const methods = await api.get('/payments/methods');
        return methods.map(methodId => ({
            id: methodId,
            name: formatMethodName(methodId)
        }));
    } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        return [];
    }
};

export const getPaymentByOrderId = async (orderId) => {
    try {
        const response = await api.get(`/payments/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch payment by order ID:', error);
        return null;
    }
};

export const getPaymentById = async (paymentId) => {
    try {
        const response = await api.get(`/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch payment by ID:', error);
        return null;
    }
};

export const checkPaymentStatus = async (orderId) => {
    try {
        const response = await api.get(`/payments/order/${orderId}/status`);
        return response.data;
    } catch (error) {
        console.error('Failed to check payment status:', error);
        return null;
    }
};

export const retryPayment = async (paymentId) => {
    try {
        const response = await api.post(`/payments/${paymentId}/retry`);
        return response.data;
    } catch (error) {
        console.error('Failed to retry payment:', error);
        return null;
    }
};

export const formatPaymentStatus = (status) => {
    const statusText = {
        'PENDING': 'Pending',
        'COMPLETED': 'Completed',
        'FAILED': 'Failed',
        'REFUNDED': 'Refunded'
    };
    return statusText[status] || status;
};

export const getPaymentStatusClass = (status) => {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'COMPLETED':
            return 'bg-green-100 text-green-800';
        case 'FAILED':
            return 'bg-red-100 text-red-800';
        case 'REFUNDED':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};



