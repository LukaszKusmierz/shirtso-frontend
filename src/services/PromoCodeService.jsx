import api from './Api.jsx';

export const validatePromoCode = (code, orderValue) => {
    return api.post('/promo-codes/validate', {
        code,
        orderValue
    });
};

export const getActivePromoCodes = () => {
    return api.get('/promo-codes/active');
};

export const getPromoCode = (promoCodeId) => {
    return api.get(`/promo-codes/${promoCodeId}`);
};
