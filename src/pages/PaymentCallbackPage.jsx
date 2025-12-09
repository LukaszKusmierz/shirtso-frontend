import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getPaymentByOrderId, checkPaymentStatus } from '../services/PaymentService';
import Spinner from '../components/common/Spinner';

const PaymentCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('checking'); // 'checking', 'success', 'pending', 'failed', 'error'
    const [message, setMessage] = useState('Verifying your payment...');
    const [orderId, setOrderId] = useState(null);
    const [pollCount, setPollCount] = useState(0);
    const MAX_POLLS = 10;
    const POLL_INTERVAL = 3000; // 3 seconds

    // Extract order ID from URL params (PayU returns extOrderId)
    const extOrderId = searchParams.get('orderId') || searchParams.get('extOrderId');
    const error = searchParams.get('error');

    const checkPayment = useCallback(async (orderIdToCheck) => {
        try {
            const [paymentData, isPaid] = await Promise.all([
                getPaymentByOrderId(orderIdToCheck),
                checkPaymentStatus(orderIdToCheck)
            ]);

            // checkPaymentStatus returns boolean directly
            if (isPaid === true || paymentData?.status === 'COMPLETED') {
                setStatus('success');
                setMessage('Payment completed successfully!');
                // Redirect to order page after delay
                setTimeout(() => {
                    navigate(`/orders/${orderIdToCheck}`, {
                        state: { message: 'Payment completed successfully! Your order is being processed.' }
                    });
                }, 2000);
                return true;
            } else if (paymentData?.status === 'FAILED' || paymentData?.status === 'REJECTED') {
                setStatus('failed');
                setMessage('Payment failed. Please try again.');
                return true;
            } else if (paymentData?.status === 'CANCELLED') {
                setStatus('failed');
                setMessage('Payment was cancelled.');
                return true;
            }

            return false; // Still pending
        } catch (err) {
            console.error('Error checking payment status:', err);
            return false;
        }
    }, [navigate]);

    useEffect(() => {
        // Handle error from PayU
        if (error) {
            setStatus('failed');
            setMessage(`Payment failed: ${error}`);
            return;
        }

        // Extract order ID from extOrderId (format: SHIRTSO-XXXXXXXX)
        // We need to find the actual order ID from the payment record
        const initializeCheck = async () => {
            if (!extOrderId) {
                setStatus('error');
                setMessage('Invalid callback: missing order information');
                return;
            }

            // Try to parse order ID if it's in a recognizable format
            // For now, we'll need to look it up via the transaction
            setOrderId(extOrderId);

            // Start polling for payment status
            const isComplete = await checkPayment(extOrderId);
            if (!isComplete) {
                setStatus('pending');
                setMessage('Payment is being processed. Please wait...');
            }
        };

        initializeCheck();
    }, [extOrderId, error, checkPayment]);

    // Poll for payment status if pending
    useEffect(() => {
        if (status !== 'pending' || !orderId || pollCount >= MAX_POLLS) return;

        const pollTimer = setTimeout(async () => {
            const isComplete = await checkPayment(orderId);
            if (!isComplete) {
                setPollCount(prev => prev + 1);
            }
        }, POLL_INTERVAL);

        return () => clearTimeout(pollTimer);
    }, [status, orderId, pollCount, checkPayment]);

    // Show timeout message after max polls
    useEffect(() => {
        if (pollCount >= MAX_POLLS && status === 'pending') {
            setStatus('pending');
            setMessage('Payment verification is taking longer than expected. Your payment may still be processing.');
        }
    }, [pollCount, status]);

    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
            case 'pending':
                return <Spinner size="lg" />;
            case 'success':
                return (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'failed':
            case 'error':
                return (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

                {getStatusIcon()}

                <p className={`text-lg mb-6 ${
                    status === 'success' ? 'text-green-600' :
                        status === 'failed' || status === 'error' ? 'text-red-600' :
                            'text-gray-600'
                }`}>
                    {message}
                </p>

                {status === 'pending' && pollCount < MAX_POLLS && (
                    <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(pollCount / MAX_POLLS) * 100}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Checking payment status... ({pollCount + 1}/{MAX_POLLS})
                        </p>
                    </div>
                )}

                {(status === 'failed' || status === 'error' || pollCount >= MAX_POLLS) && (
                    <div className="space-y-3">
                        {orderId && (
                            <Link
                                to={`/checkout/payment/${orderId}`}
                                className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                Try Again
                            </Link>
                        )}
                        <Link
                            to="/orders"
                            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                        >
                            View My Orders
                        </Link>
                        <Link
                            to="/"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Return to Home
                        </Link>
                    </div>
                )}

                {status === 'success' && (
                    <p className="text-sm text-gray-500">
                        Redirecting to your order...
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentCallbackPage;