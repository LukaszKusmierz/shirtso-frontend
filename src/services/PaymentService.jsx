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

export const getPaymentMethods = async () => {
    const response = await api.get('/payments/methods');
    return response.data.map(methodId => ({
        id: methodId,
        name: formatMethodName(methodId)
    }));
};


