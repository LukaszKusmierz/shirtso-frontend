import api from './Api.jsx';

export const createOrder = (cartId) => {
    return api.post('/orders', {
        cartId
    });
};

export const getUserOrders = () => {
    return api.get('/orders');
};

export const getOrderDetails = (orderId) => {
    return api.get(`/orders/${orderId}`);
};

export const cancelOrder = (orderId) => {
    return api.post(`/orders/${orderId}/cancel`);
};

export const updateOrderStatus = (orderId, orderStatus) => {
    return api.put(`/orders/${orderId}/status`, {
        orderStatus
    });
};
