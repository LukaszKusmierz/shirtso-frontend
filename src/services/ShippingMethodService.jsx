import api from './Api.jsx';

export const getActiveShippingMethods = () => {
    return api.get('/shipping/methods');
};

export const getShippingMethod = (shippingMethodId) => {
    return api.get(`/shipping/methods/${shippingMethodId}`);
};
