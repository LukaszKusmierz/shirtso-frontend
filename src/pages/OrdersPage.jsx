import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getUserOrders } from '../services/OrderService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/orders' } });
            return;
        }
        fetchOrders();
    }, [currentUser, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const ordersData = await getUserOrders();
            setOrders(ordersData);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Failed to load your orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-100 text-blue-800';
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handlePayNow = (order) => {
        navigate(`/checkout/payment/${order.orderId}`, {
            state: {
                orderId: order.orderId,
                total: parseFloat(order.total),
                subtotal: parseFloat(order.subtotal)
            }
        });
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
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            {orders.length > 0 ? (
                <>
                    {/* Show unpaid orders alert if any */}
                    {orders.some(order => order.status === 'NEW') && (
                        <Alert
                            type="warning"
                            message="You have unpaid orders. Please complete payment to process them."
                            dismissible={true}
                            onDismiss={() => {}}
                            className="mb-4"
                        />
                    )}

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => {
                                    const isUnpaid = order.status === 'NEW';

                                    return (
                                        <tr
                                            key={order.orderId}
                                            className={`hover:bg-gray-50 ${isUnpaid ? 'bg-blue-50' : ''}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{order.orderId}
                                                    </div>
                                                    {isUnpaid && (
                                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                                                                Unpaid
                                                            </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{order.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.total} EUR
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.itemCount}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {isUnpaid && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handlePayNow(order)}
                                                        >
                                                            Pay Now
                                                        </Button>
                                                    )}
                                                    <Link
                                                        to={`/orders/${order.orderId}`}
                                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Orders Summary */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-600">Total Orders</div>
                            <div className="text-2xl font-bold">{orders.length}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-600">Unpaid Orders</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {orders.filter(o => o.status === 'NEW').length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-600">Processing</div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {orders.filter(o => o.status === 'PROCESSING').length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-600">Delivered</div>
                            <div className="text-2xl font-bold text-green-600">
                                {orders.filter(o => o.status === 'DELIVERED').length}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                    </svg>
                    <h2 className="text-xl font-semibold mb-4">You don't have any orders yet</h2>
                    <p className="mb-6 text-gray-600">Start shopping to place your first order!</p>
                    <Link
                        to="/products"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;