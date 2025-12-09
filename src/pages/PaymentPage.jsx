import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getOrderDetails } from '../services/OrderService';
import {
    getPaymentMethods,
    processPayment,
    checkPaymentStatus,
    getPaymentByOrderId,
    requiresRedirect,
    isRedirectPaymentMethod,
    requiresCardDetails as checkRequiresCardDetails,
    getPaymentMethodIcon,
    redirectToPaymentGateway
} from '../services/PaymentService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CartEventService from '../services/CartEventService';

const PaymentPage = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [existingPayment, setExistingPayment] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CREDIT_CARD');
    const currency = order?.items?.[0]?.currency || '';
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
    const [redirecting, setRedirecting] = useState(false);
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

    // Check if selected method requires card details
    const showCardForm = checkRequiresCardDetails(selectedPaymentMethod);

    // Check if selected method uses redirect flow (PayU)
    const usesRedirectFlow = isRedirectPaymentMethod(selectedPaymentMethod);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [orderData, methods] = await Promise.all([
                getOrderDetails(orderId),
                getPaymentMethods()
            ]);
            console.log('Order data:', orderData);
            console.log('Items:', orderData.items);

            setOrder(orderData);
            setPaymentMethods(methods);

            if (orderData.orderStatus !== 'NEW') {
                try {
                    const [paymentData, isPaid] = await Promise.all([
                        getPaymentByOrderId(orderId),
                        checkPaymentStatus(orderId)
                    ]);

                    // checkPaymentStatus returns boolean directly
                    if (isPaid === true || paymentData?.status === 'COMPLETED') {
                        navigate(`/orders/${orderId}`, {
                            state: { message: 'This order has already been paid.' }
                        });
                        return;
                    }

                    if (paymentData) {
                        setExistingPayment({
                            ...paymentData
                        });

                        if (paymentData.status === 'FAILED') {
                            setError('Previous payment attempt failed. Please try again with valid payment details.');
                        } else if (paymentData.status === 'PENDING') {
                            setError('A payment is currently pending. Please wait for it to complete or try again.');
                        }
                    }
                } catch {
                    console.log('No existing payment found or failed to check status');
                }
            }

            setError(null);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load order details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [orderId, navigate]);

    useEffect(() => {
        if (currentUser) fetchData();
        else navigate('/login', { state: { from: `/checkout/payment/${orderId}` } });
    }, [currentUser, orderId, navigate, fetchData]);

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
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
            const cleanNumber = formattedValue.replace(/\s/g, '');
            if (cleanNumber.length > 0 && cleanNumber.length < 13) {
                newValidationErrors.cardNumber = 'Card number must be at least 13 digits';
            } else {
                newValidationErrors.cardNumber = '';
            }
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
            const [month, year] = formattedValue.split('/').map(Number);
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear() % 100;

            if (formattedValue && !formattedValue.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
                if (formattedValue.length >= 5) {
                    newValidationErrors.expiryDate = 'Please enter a valid date (MM/YY)';
                }
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newValidationErrors.expiryDate = 'Card has expired';
            } else {
                newValidationErrors.expiryDate = '';
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
            if (formattedValue && !formattedValue.match(/^\d{3,4}$/)) {
                if (formattedValue.length >= 3) {
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
        if (!showCardForm) return true;

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

        if (showCardForm && !validateCardDetails()) {
            setError('Please correct the errors in the form');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const paymentData = {
                orderId: parseInt(orderId),
                paymentMethod: selectedPaymentMethod,
                ...(showCardForm && {
                    cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
                    cardHolderName: cardDetails.cardHolderName,
                    expiryDate: cardDetails.expiryDate,
                    cvv: cardDetails.cvv
                })
            };

            const paymentResponse = await processPayment(paymentData);

            // Check if PayU returned a redirect URL
            if (requiresRedirect(paymentResponse)) {
                setRedirecting(true);
                setSuccessMessage('Redirecting to payment gateway...');

                // Clear cart
                await CartEventService.emitCartChange();

                // Redirect to PayU payment page
                redirectToPaymentGateway(paymentResponse.redirectUrl, 1000);
                return;
            }

            // Direct payment completed (mock gateway)
            await CartEventService.emitCartChange();

            // Clear form
            setCardDetails({
                cardNumber: '',
                cardHolderName: '',
                expiryDate: '',
                cvv: ''
            });

            setSuccessMessage('Payment processed successfully! Redirecting...');

            // Redirect after a short delay
            setTimeout(() => {
                navigate(`/orders/${orderId}`, {
                    state: {
                        message: 'Payment completed successfully! Your order is being processed.',
                        paymentId: paymentResponse.paymentId
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('Payment failed:', err);

            let errorMessage = 'Payment processing failed. Please try again.';

            if (err.response) {
                if (err.response.status === 400) {
                    const serverMessage = err.response.data?.message;
                    if (serverMessage?.includes('already exists')) {
                        errorMessage = 'This order has already been paid.';
                        setTimeout(() => navigate(`/orders/${orderId}`), 2000);
                    } else if (serverMessage?.includes('declined')) {
                        errorMessage = 'Payment was declined. Please check your card details.';
                    } else {
                        errorMessage = serverMessage || 'Invalid payment details.';
                    }
                } else if (err.response.status === 404) {
                    errorMessage = 'Order not found.';
                } else {
                    errorMessage = 'Payment processing failed. Please try again.';
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            if (!redirecting) {
                setSubmitting(false);
            }
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

    if (!order) {
        return (
            <div className="container mx-auto p-4">
                <Alert
                    type="error"
                    message="Order not found"
                    dismissible={false}
                    className="mb-4"
                />
                <Link to="/orders" className="text-blue-600 hover:underline">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const displayTotal = total ?? order?.totalAmount ?? 0;

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Complete Payment</h1>
                <Link to={`/orders/${orderId}`} className="text-blue-600 hover:underline">
                    ← Back to Order
                </Link>
            </div>

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

            {existingPayment && existingPayment.status === 'FAILED' && (
                <Alert
                    type="warning"
                    message="A previous payment attempt failed. Please check your payment details and try again."
                    dismissible={true}
                    onDismiss={() => setExistingPayment(null)}
                    className="mb-4"
                />
            )}

            {redirecting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
                        <Spinner size="lg" />
                        <p className="mt-4 text-lg font-medium">Redirecting to payment gateway...</p>
                        <p className="text-sm text-gray-500 mt-2">Please do not close this window.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Payment Method
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {paymentMethods.length > 0 ? (
                                        paymentMethods.map(method => (
                                            <div
                                                key={method.id}
                                                className={`flex items-center p-3 border rounded cursor-pointer transition
                                                    ${selectedPaymentMethod === method.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50'}`}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                            >
                                                <input
                                                    type="radio"
                                                    id={method.id}
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={selectedPaymentMethod === method.id}
                                                    onChange={handlePaymentMethodChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={method.id}
                                                    className="ml-3 flex items-center text-sm text-gray-700 cursor-pointer flex-1"
                                                >
                                                    <span className="mr-2">{getPaymentMethodIcon(method.id)}</span>
                                                    {method.name}
                                                    {isRedirectPaymentMethod(method.id) && (
                                                        <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                                                            Redirect
                                                        </span>
                                                    )}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No payment methods available</p>
                                    )}
                                </div>
                            </div>

                            {/* Card details form - only show for card payments */}
                            {showCardForm && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium mb-4">Card Details</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                className={`w-full p-3 border ${validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-blue-500`}
                                                required={showCardForm}
                                                maxLength={19}
                                            />
                                            {validationErrors.cardNumber && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.cardNumber}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                Test cards: 4111111111111111 (✓ success) or 4242424242424242 (✗ failure)
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cardholder Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="cardHolderName"
                                                value={cardDetails.cardHolderName}
                                                onChange={handleCardInputChange}
                                                placeholder="John Doe"
                                                className={`w-full p-3 border ${validationErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-blue-500`}
                                                required={showCardForm}
                                            />
                                            {validationErrors.cardHolderName && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.cardHolderName}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expiry Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={cardDetails.expiryDate}
                                                    onChange={handleCardInputChange}
                                                    placeholder="MM/YY"
                                                    className={`w-full p-3 border ${validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-blue-500`}
                                                    required={showCardForm}
                                                    maxLength={5}
                                                />
                                                {validationErrors.expiryDate && (
                                                    <p className="mt-1 text-xs text-red-500">{validationErrors.expiryDate}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    CVV <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardInputChange}
                                                    placeholder="123"
                                                    className={`w-full p-3 border ${validationErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-blue-500`}
                                                    required={showCardForm}
                                                    maxLength={4}
                                                />
                                                {validationErrors.cvv && (
                                                    <p className="mt-1 text-xs text-red-500">{validationErrors.cvv}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                        <div className="flex">
                                            <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-blue-800">
                                                Your payment information is secure and encrypted. We never store your full card details.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info for redirect-based payments */}
                            {usesRedirectFlow && (
                                <div className="border-t pt-6">
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                                        <div className="flex">
                                            <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-yellow-800 font-medium">
                                                    You will be redirected to complete payment
                                                </p>
                                                <p className="text-sm text-yellow-700 mt-1">
                                                    After clicking "Pay", you'll be redirected to a secure payment page to complete your transaction.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pay on collection info */}
                            {selectedPaymentMethod === 'PAY_ON_COLLECTION' && (
                                <div className="border-t pt-6">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                                        <div className="flex">
                                            <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-green-800 font-medium">
                                                    Pay when you collect your order
                                                </p>
                                                <p className="text-sm text-green-700 mt-1">
                                                    No payment required now. You can pay in cash or card when collecting your order.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-8 pt-6 border-t">
                                <Link
                                    to={`/orders/${orderId}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    ← Cancel
                                </Link>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={submitting || redirecting}
                                    loading={submitting}
                                    className="px-8"
                                >
                                    {submitting
                                        ? (usesRedirectFlow ? 'Redirecting...' : 'Processing...')
                                        : selectedPaymentMethod === 'PAY_ON_COLLECTION'
                                            ? 'Confirm Order'
                                            : `Pay ${displayTotal} ${currency}`
                                    }
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="border-t border-b py-4 mb-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">#{order.orderId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium">{order.orderStatus}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span>{subtotal || order.subtotalAmount} {currency}</span>
                            </div>
                            {(shippingCost || order.shippingAmount) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span>{shippingCost || order.shippingAmount} {currency}</span>
                                </div>
                            )}
                            {(discount || order.discountAmount) > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount:</span>
                                    <span>-{discount || order.discountAmount} {currency}</span>
                                </div>
                            )}
                            {order.taxAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax:</span>
                                    <span>{order.taxAmount} {currency}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-blue-600">{displayTotal} {currency}</span>
                        </div>
                    </div>

                    {address && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
                            <div className="text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{address.fullName}</p>
                                <p>{address.streetAddress}</p>
                                <p>{address.city}, {address.postalCode}</p>
                                <p>{address.country}</p>
                                {address.phone && <p className="mt-2">{address.phone}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;