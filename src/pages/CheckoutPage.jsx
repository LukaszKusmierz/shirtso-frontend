import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: currentUser?.username || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Poland',
        phoneNumber: '',
        paymentMethod: 'card'
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    if (cartItems.length === 0 && !orderSuccess) {
        navigate('/cart');
        return null;
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                // Here you would normally send the order to your backend API
                // For demonstration, we'll simulate a successful order after 1.5 seconds
                await new Promise(resolve => setTimeout(resolve, 1500));

                setOrderSuccess(true);
                clearCart();
                setIsSubmitting(false);
            } catch (error) {
                console.error('Error placing order:', error);
                setIsSubmitting(false);
                // Handle error here
            }
        }
    };

    if (orderSuccess) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-2xl font-bold text-green-800 mt-4 mb-2">Order Placed Successfully!</h2>
                    <p className="text-green-700 mb-6">
                        Thank you for your purchase. Your order has been received and is being processed.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="divide-y divide-gray-200">
                            {cartItems.map(item => (
                                <div key={`${item.productId}-${item.size}`} className="py-3 flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} {item.currency}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between mb-2">
                                <p>Subtotal</p>
                                <p>{totalPrice.toFixed(2)} {cartItems[0]?.currency || 'PLN'}</p>
                            </div>
                            <div className="flex justify-between mb-2">
                                <p>Shipping</p>
                                <p>15.00 {cartItems[0]?.currency || 'PLN'}</p>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4">
                                <p>Total</p>
                                <p>{(totalPrice + 15).toFixed(2)} {cartItems[0]?.currency || 'PLN'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.address && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.city && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.postalCode && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Poland">Poland</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Czech Republic">Czech Republic</option>
                                    <option value="Slovakia">Slovakia</option>
                                    <option value="Ukraine">Ukraine</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {formErrors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                            )}
                        </div>

                        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <input
                                    id="paymentCard"
                                    name="paymentMethod"
                                    type="radio"
                                    value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="paymentCard" className="ml-3 block text-sm font-medium text-gray-700">
                                    Credit / Debit Card
                                </label>
                            </div>

                            <div className="flex items-center mb-4">
                                <input
                                    id="paymentPaypal"
                                    name="paymentMethod"
                                    type="radio"
                                    value="paypal"
                                    checked={formData.paymentMethod === 'paypal'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="paymentPaypal" className="ml-3 block text-sm font-medium text-gray-700">
                                    PayPal
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="paymentBankTransfer"
                                    name="paymentMethod"
                                    type="radio"
                                    value="bank"
                                    checked={formData.paymentMethod === 'bank'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="paymentBankTransfer" className="ml-3 block text-sm font-medium text-gray-700">
                                    Bank Transfer
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Processing...' : `Place Order - ${(totalPrice + 15).toFixed(2)} ${cartItems[0]?.currency || 'PLN'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
