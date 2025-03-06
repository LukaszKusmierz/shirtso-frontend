import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'account', label: 'Account Information' },
        { id: 'orders', label: 'Order History' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const AccountInformation = ({ currentUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData(prevData => ({
                ...prevData,
                username: currentUser.username || '',
                email: currentUser.username || '' // Assuming email is used as username
            }));
        }
    }, [currentUser]);

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (formData.password && formData.password.length < 12) {
            errors.password = 'Password must be at least 12 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

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
                // Here you would call your API to update the user profile
                // For demonstration, we'll simulate a successful update
                await new Promise(resolve => setTimeout(resolve, 1000));

                setUpdateSuccess(true);
                setIsSubmitting(false);

                // Reset password fields
                setFormData(prevData => ({
                    ...prevData,
                    password: '',
                    confirmPassword: ''
                }));

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setUpdateSuccess(false);
                }, 3000);
            } catch (error) {
                console.error('Error updating profile:', error);
                setIsSubmitting(false);
                // Handle error
            }
        }
    };

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Account Information</h3>

            {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    Your account information has been updated successfully.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.username && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
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

                <h4 className="text-lg font-medium text-gray-800 mt-8 mb-4">Change Password</h4>
                <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Here you would call your API to get the user's order history
                // For demonstration, we'll set some mock data
                await new Promise(resolve => setTimeout(resolve, 800));

                setOrders([
                    {
                        id: '12345',
                        date: '2023-11-15',
                        status: 'Delivered',
                        total: 1289.97,
                        items: [
                            { name: 'Jeansy', size: 'L', quantity: 1, price: 519.99 },
                            { name: 'Sweter', size: 'XL', quantity: 2, price: 119.99 },
                            { name: 'Marynarka', size: 'M', quantity: 1, price: 630.00 }
                        ]
                    },
                    {
                        id: '12344',
                        date: '2023-10-28',
                        status: 'Processing',
                        total: 519.99,
                        items: [
                            { name: 'Jeansy', size: 'M', quantity: 1, price: 519.99 }
                        ]
                    }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Link
                    to="/products"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Order History</h3>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
                            </div>
                        </div>

                        <div className="px-4 py-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-4 text-sm text-gray-900">{item.name}</td>
                                        <td className="px-2 py-4 text-sm text-gray-500">{item.size}</td>
                                        <td className="px-2 py-4 text-sm text-gray-500">{item.quantity}</td>
                                        <td className="px-2 py-4 text-sm text-gray-900">{item.price.toFixed(2)} PLN</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-lg font-semibold text-gray-900">{order.total.toFixed(2)} PLN</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Settings = () => {
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true
    });

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('english');
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleDarkModeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Here you would call your API to update settings
        // For demonstration, we'll simulate a success
        await new Promise(resolve => setTimeout(resolve, 500));

        setUpdateSuccess(true);

        // Clear success message after 3 seconds
        setTimeout(() => {
            setUpdateSuccess(false);
        }, 3000);
    };

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Settings</h3>

            {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    Your settings have been updated successfully.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Notifications</h4>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="orderUpdates"
                                    name="orderUpdates"
                                    type="checkbox"
                                    checked={notifications.orderUpdates}
                                    onChange={handleNotificationChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="orderUpdates" className="font-medium text-gray-700">Order Updates</label>
                                <p className="text-gray-500">Receive notifications about your order status changes.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="promotions"
                                    name="promotions"
                                    type="checkbox"
                                    checked={notifications.promotions}
                                    onChange={handleNotificationChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="promotions" className="font-medium text-gray-700">Promotions</label>
                                <p className="text-gray-500">Receive notifications about sales and special offers.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="newsletter"
                                    name="newsletter"
                                    type="checkbox"
                                    checked={notifications.newsletter}
                                    onChange={handleNotificationChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="newsletter" className="font-medium text-gray-700">Newsletter</label>
                                <p className="text-gray-500">Receive our monthly newsletter with fashion tips and trends.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Preferences</h4>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                                Language
                            </label>
                            <select
                                id="language"
                                name="language"
                                value={language}
                                onChange={handleLanguageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="english">English</option>
                                <option value="polish">Polish</option>
                                <option value="german">German</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                                <p className="text-sm text-gray-500">Switch between light and dark mode.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDarkModeToggle}
                                className={`${
                                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                <span className="sr-only">Toggle dark mode</span>
                                <span
                                    className={`${
                                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('account');
    const { currentUser } = useAuth();

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="p-6">
                    {activeTab === 'account' && <AccountInformation currentUser={currentUser} />}
                    {activeTab === 'orders' && <OrderHistory />}
                    {activeTab === 'settings' && <Settings />}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
