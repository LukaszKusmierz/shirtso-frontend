import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../hooks/UseAuth';
import {getOrderDetails} from '../services/OrderService';
import {getPaymentMethods, processPayment} from '../services/PaymentService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CartEventService from "../services/CartEventService";

const PaymentPage = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CREDIT_CARD');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });
    const [validationErrors, setValidationErrors] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const checkoutDetails = location.state || {};
    const {
        subtotal,
        shippingCost = 0,
        discount = 0,
        total,
        address
    } = checkoutDetails;

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: `/checkout/payment/${orderId}` } });
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const [orderData, methods] = await Promise.all([
                    getOrderDetails(orderId),
                    getPaymentMethods()
                ]);
                setOrder(orderData);
                setPaymentMethods(methods);
                if (orderData.orderStatus !== 'NEW') {
                    navigate(`/orders/${orderId}`);
                    return;
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, orderId, navigate]);
    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
        // Clear validation errors when changing payment method
        setValidationErrors({
            cardNumber: '',
            cardHolderName: '',
            expiryDate: '',
            cvv: ''
        });
    };
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };
    const formatExpiryDate = (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length > 2) {
            return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
        }
        return digits;
    };
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        let newValidationErrors = { ...validationErrors };

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
            if (formattedValue.replace(/\s/g, '').length > 0 && formattedValue.replace(/\s/g, '').length < 13) {
                newValidationErrors.cardNumber = 'Card number must be at least 13 digits';
            } else {
                newValidationErrors.cardNumber = '';
            }
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
            if (formattedValue && !formattedValue.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
                if (formattedValue.length >= 5) {
                    newValidationErrors.expiryDate = 'Please enter a valid date (MM/YY)';
                }
            } else {
                newValidationErrors.expiryDate = '';
            }
        } else if (name === 'cvv') {
            if (value && !value.match(/^\d{3,4}$/)) {
                if (value.length >= 3) {
                    newValidationErrors.cvv = 'CVV must be 3 or 4 digits';
                }
            } else {
                newValidationErrors.cvv = '';
            }
        } else if (name === 'cardHolderName') {
            if (!value.trim()) {
                newValidationErrors.cardHolderName = 'Cardholder name is required';
            } else {
                newValidationErrors.cardHolderName = '';
            }
        }
        setCardDetails((prev) => ({
            ...prev,
            [name]: formattedValue
        }));
        setValidationErrors(newValidationErrors);
    };

    const validateCardDetails = () => {
        if (selectedPaymentMethod !== 'CREDIT_CARD') return true;
        const { cardNumber, cardHolderName, expiryDate, cvv } = cardDetails;

        let isValid = true;
        const newValidationErrors = {
            cardNumber: '',
            cardHolderName: '',
            expiryDate: '',
            cvv: ''
        };
        const cleanCardNumber = cardNumber.replace(/\s/g, '');

        if (!cleanCardNumber || cleanCardNumber.length < 13) {
            newValidationErrors.cardNumber = 'Please enter a valid card number';
            isValid = false;
        }
        if (!cardHolderName.trim()) {
            newValidationErrors.cardHolderName = 'Please enter the cardholder name';
            isValid = false;
        }
        if (!expiryDate.trim() || !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            newValidationErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
            isValid = false;
        }
        if (!cvv.trim() || !cvv.match(/^\d{3,4}$/)) {
            newValidationErrors.cvv = 'Please enter a valid CVV code';
            isValid = false;
        }
        setValidationErrors(newValidationErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCardDetails()) {
            setError('Please correct the errors in the form');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const paymentData = {
                orderId: parseInt(orderId),
                paymentMethod: selectedPaymentMethod,
                ...(selectedPaymentMethod === 'CREDIT_CARD' && {
                    cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
                    cardHolderName: cardDetails.cardHolderName,
                    expiryDate: cardDetails.expiryDate,
                    cvv: cardDetails.cvv
                })
            };

            await processPayment(paymentData);
            CartEventService.emitCartChange();
            setSuccessMessage('Payment processed successfully! Redirecting to order details...');
            setCardDetails({
                cardNumber: '',
                cardHolderName: '',
                expiryDate: '',
                cvv: ''
            });

            setTimeout(() => {
                navigate(`/orders/${orderId}`);
            }, 2000);
        } catch (err) {
            console.error('Payment failed:', err);

            if (err.message?.includes('declined')) {
                setError('Payment was declined. Please check your card details or try another payment method.');
            } else if (err.message?.includes('network')) {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('Payment processing failed. Please check your details and try again.');
            }
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    const displayTotal = total || (order?.totalAmount || 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Payment</h1>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    dismissible={false}
                    className="mb-4"
                />
            )}

            {order && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Payment Method
                                    </label>
                                    <div className="space-y-2">
                                        {paymentMethods.length > 0 ? (
                                            paymentMethods.map(method => (
                                                <div key={method.id} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={method.id}
                                                        name="paymentMethod"
                                                        value={method.id}
                                                        checked={selectedPaymentMethod === method.id}
                                                        onChange={handlePaymentMethodChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={method.id} className="ml-2 block text-sm text-gray-700">
                                                        {method.name}
                                                    </label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No payment methods available</p>
                                        )}
                                    </div>
                                </div>

                                {selectedPaymentMethod === 'CREDIT_CARD' && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-medium mb-4">Credit Card Details</h3>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                className={`w-full p-2 border ${validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
                                                required={selectedPaymentMethod === 'CREDIT_CARD'}
                                                maxLength={19}
                                            />
                                            {validationErrors.cardNumber && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.cardNumber}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                For testing, use 4111111111111111 (success) or 4242424242424242 (failure)
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                name="cardHolderName"
                                                value={cardDetails.cardHolderName}
                                                onChange={handleCardInputChange}
                                                placeholder="John Doe"
                                                className={`w-full p-2 border ${validationErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'} rounded`}
                                                required={selectedPaymentMethod === 'CREDIT_CARD'}
                                            />
                                            {validationErrors.cardHolderName && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.cardHolderName}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={cardDetails.expiryDate}
                                                    onChange={handleCardInputChange}
                                                    placeholder="MM/YY"
                                                    className={`w-full p-2 border ${validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded`}
                                                    required={selectedPaymentMethod === 'CREDIT_CARD'}
                                                    maxLength={5}
                                                />
                                                {validationErrors.expiryDate && (
                                                    <p className="mt-1 text-xs text-red-500">{validationErrors.expiryDate}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardInputChange}
                                                    placeholder="123"
                                                    className={`w-full p-2 border ${validationErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded`}
                                                    required={selectedPaymentMethod === 'CREDIT_CARD'}
                                                    maxLength={4}
                                                />
                                                {validationErrors.cvv && (
                                                    <p className="mt-1 text-xs text-red-500">{validationErrors.cvv}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-6">
                                    <Link
                                        to="/checkout"
                                        state={{ ...checkoutDetails, orderId }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ← Back to Checkout
                                    </Link>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={submitting}
                                        loading={submitting}
                                    >
                                        {submitting ? 'Processing...' : `Pay ${displayTotal} EUR`}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="border-t border-b py-4 mb-4">
                                <div className="flex justify-between py-1">
                                    <span>Order ID:</span>
                                    <span>#{order.orderId}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>Status:</span>
                                    <span>{order.orderStatus}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>Subtotal:</span>
                                    <span>{subtotal || order.totalAmount} EUR</span>
                                </div>
                                {shippingCost > 0 && (
                                    <div className="flex justify-between py-1">
                                        <span>Shipping:</span>
                                        <span>{shippingCost} EUR</span>
                                    </div>
                                )}
                                {discount > 0 && (
                                    <div className="flex justify-between py-1 text-green-600">
                                        <span>Discount:</span>
                                        <span>-{discount} EUR</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>{displayTotal} EUR</span>
                            </div>
                        </div>

                        {address && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
                                <div className="text-sm">
                                    <p className="font-medium">{address.fullName}</p>
                                    <p>{address.streetAddress}</p>
                                    <p>{address.city}, {address.postalCode}</p>
                                    <p>{address.country}</p>
                                    <p>{address.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;

//TODO: fix currency and when user go to payment site the order is being created - WRONG!