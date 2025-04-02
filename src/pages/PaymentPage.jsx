import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getOrderDetails } from '../services/OrderService';
import { processPayment, getPaymentMethods } from '../services/PaymentService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Get checkout details from location state
    const checkoutDetails = location.state || {};
    const {
        subtotal,
        shippingCost = 0,
        discount = 0,
        total,
        address,
        shippingMethod,
        promoCode
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
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validateCardDetails = () => {
        if (selectedPaymentMethod !== 'CREDIT_CARD') return true;

        const { cardNumber, cardHolderName, expiryDate, cvv } = cardDetails;

        if (!cardNumber.trim() || cardNumber.length < 13) {
            setError('Please enter a valid card number.');
            return false;
        }

        if (!cardHolderName.trim()) {
            setError('Please enter the cardholder name.');
            return false;
        }

        if (!expiryDate.trim() || !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            setError('Please enter a valid expiry date (MM/YY).');
            return false;
        }

        if (!cvv.trim() || !cvv.match(/^\d{3,4}$/)) {
            setError('Please enter a valid CVV code.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCardDetails()) return;

        setSubmitting(true);
        setError(null);

        try {
            const paymentData = {
                orderId: parseInt(orderId),
                paymentMethod: selectedPaymentMethod,
                ...(selectedPaymentMethod === 'CREDIT_CARD' && {
                    cardNumber: cardDetails.cardNumber,
                    cardHolderName: cardDetails.cardHolderName,
                    expiryDate: cardDetails.expiryDate,
                    cvv: cardDetails.cvv
                })
            };

            const paymentResponse = await processPayment(paymentData);
            setSuccessMessage('Payment processed successfully!');
            setTimeout(() => {
                navigate(`/orders/${orderId}`);
            }, 2000);
        } catch (err) {
            console.error('Payment failed:', err);
            setError('Payment processing failed. Please check your details and try again.');
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

    // Calculate display total if not provided
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
                                        {paymentMethods.map(method => (
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
                                        ))}
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
                                                className="w-full p-2 border border-gray-300 rounded"
                                                required={selectedPaymentMethod === 'CREDIT_CARD'}
                                                maxLength={19}
                                            />
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
                                                className="w-full p-2 border border-gray-300 rounded"
                                                required={selectedPaymentMethod === 'CREDIT_CARD'}
                                            />
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
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    required={selectedPaymentMethod === 'CREDIT_CARD'}
                                                    maxLength={5}
                                                />
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
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    required={selectedPaymentMethod === 'CREDIT_CARD'}
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-6">
                                    <a
                                        href={`/checkout`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ← Back to Checkout
                                    </a>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={submitting}
                                        loading={submitting}
                                    >
                                        {submitting ? 'Processing...' : `Pay ${displayTotal} PLN`}
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
                                    <span>{subtotal || order.totalAmount} PLN</span>
                                </div>
                                {shippingCost > 0 && (
                                    <div className="flex justify-between py-1">
                                        <span>Shipping:</span>
                                        <span>{shippingCost} PLN</span>
                                    </div>
                                )}
                                {discount > 0 && (
                                    <div className="flex justify-between py-1 text-green-600">
                                        <span>Discount:</span>
                                        <span>-{discount} PLN</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>{displayTotal} PLN</span>
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