import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getCart } from '../services/CartService';
import { createOrder } from '../services/OrderService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const CheckoutPage = () => {
    const [cart, setCart] = useState(null);
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        const fetchCart = async () => {
            setLoading(true);
            try {
                const cartData = await getCart();
                setCart(cartData);

                if (!cartData || !cartData.items || cartData.items.length === 0) {
                    navigate('/cart');
                    return;
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch cart:', err);
                setError('Failed to load your shopping cart. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['fullName', 'streetAddress', 'city', 'postalCode', 'country', 'phone'];
        for (const field of requiredFields) {
            if (!shippingDetails[field].trim()) {
                setError(`Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setSubmitting(true);
        setError(null);

        try {
            const orderResponse = await createOrder(cart.cartId);
            setOrderId(orderResponse.orderId);
            setOrderCreated(true);
            navigate(`/checkout/payment/${orderResponse.orderId}`);
        } catch (err) {
            console.error('Failed to create order:', err);
            setError('Failed to process your order. Please try again.');
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingDetails.fullName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingDetails.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={shippingDetails.streetAddress}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingDetails.city}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={shippingDetails.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={shippingDetails.country}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <a
                                    href="/cart"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ← Back to Cart
                                </a>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={submitting}
                                    loading={submitting}
                                >
                                    Proceed to Payment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        {cart && (
                            <>
                                <div className="border-t border-b py-4 mb-4">
                                    <div className="max-h-60 overflow-y-auto">
                                        {cart.items.map((item) => (
                                            <div key={item.cartItemId} className="flex justify-between py-2">
                                                <div>
                                                    <span className="font-medium">{item.product.productName}</span>
                                                    <span className="text-gray-600 block">Qty: {item.quantity}</span>
                                                </div>
                                                <span>{item.totalAmount} PLN</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between mt-4">
                                        <span>Items ({cart.totalItems}):</span>
                                        <span>{cart.totalAmount} PLN</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>{cart.totalAmount} PLN</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
