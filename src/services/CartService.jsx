import api from './Api.jsx';
import CartEventService from "./CartEventService";

export const getCart = () => {
    return api.get('/cart');
};

export const addToCart = async (productId, quantity) => {
    const result = await api.post('/cart', {
        productId,
        quantity
    });
    CartEventService.emitCartChange();
    return result;
};

export const updateCartItem = async (cartItemId, quantity) => {
    const result = await api.put('/cart', {
        cartItemId,
        quantity
    });
    CartEventService.emitCartChange();
    return result;
};

export const removeCartItem = async (cartItemId) => {
    const result = await api.delete(`/cart/${cartItemId}`);
    CartEventService.emitCartChange();
    return result;
};

export const clearCart = async () => {
    const result = await api.delete('/cart');
    CartEventService.emitCartChange();
    return result;
};
