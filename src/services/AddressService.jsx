import api from './Api.jsx';

export const getUserAddresses = () => {
    return api.get('/addresses');
};

export const getAddress = (addressId) => {
    return api.get(`/addresses/${addressId}`);
};

export const createAddress = (addressData) => {
    return api.post('/addresses', addressData);
};

export const updateAddress = (addressId, addressData) => {
    return api.put(`/addresses/${addressId}`, addressData);
};

export const deleteAddress = (addressId) => {
    return api.delete(`/addresses/${addressId}`);
};

export const getDefaultAddress = () => {
    return api.get('/addresses/default');
};

export const setDefaultAddress = (addressId) => {
    return api.put(`/addresses/${addressId}/default`);
};
