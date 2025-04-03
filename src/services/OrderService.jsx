import api from './Api.jsx';

export const createOrder = (cartId, shippingMethodId, addressId, promoCode) => {
    const orderData = {
        cartId
    };
    if (shippingMethodId) orderData.shippingMethodId = shippingMethodId;
    if (addressId) orderData.addressId = addressId;
    if (promoCode) orderData.promoCode = promoCode;
    return api.post('/orders', orderData);
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
