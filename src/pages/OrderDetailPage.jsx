import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getOrderDetails, cancelOrder } from '../services/OrderService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: `/orders/${orderId}` } });
            return;
        }
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                const orderData = await getOrderDetails(orderId);
                setOrder(orderData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [currentUser, orderId, navigate]);
    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }
        setCancelling(true);
        try {
            await cancelOrder(orderId);
            const updatedOrder = await getOrderDetails(orderId);
            setOrder(updatedOrder);
            setSuccessMessage('Order has been cancelled successfully.');
        } catch (err) {
            console.error('Failed to cancel order:', err);
            setError('Failed to cancel order. Please try again.');
        } finally {
            setCancelling(false);
        }
    };
    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString();
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

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <Link to="/orders" className="text-blue-600 hover:underline">
                    ← Back to Orders
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
                    dismissible={true}
                    onDismiss={() => setSuccessMessage(null)}
                    className="mb-4"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Order #{order.orderId}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <span className="block text-sm text-gray-600">Order Date</span>
                                <span className="block font-medium">{formatDate(order.createdAt)}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-gray-600">Customer</span>
                                <span className="block font-medium">{order.userName}</span>
                            </div>
                        </div>

                        {(order.orderStatus === 'NEW' || order.orderStatus === 'PROCESSING') && (
                            <div className="mt-6">
                                <Button
                                    variant="danger"
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    loading={cancelling}
                                >
                                    Cancel Order
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Items</h2>

                        <div className="border-t border-b py-2">
                            <div className="flex font-medium text-sm text-gray-500 mb-2">
                                <div className="w-2/5">Item</div>
                                <div className="w-1/5 text-center">Price</div>
                                <div className="w-1/5 text-center">Quantity</div>
                                <div className="w-1/5 text-right">Total</div>
                            </div>

                            {order.items.map((item) => (
                                <div key={item.orderItemId} className="flex py-3 border-t">
                                    <div className="w-2/5">
                                        <Link to={`/products/${item.productId}`} className="font-medium hover:text-blue-600">
                                            {item.productName}
                                        </Link>
                                    </div>
                                    <div className="w-1/5 text-center">{item.price} EUR</div>
                                    <div className="w-1/5 text-center">{item.quantity}</div>
                                    <div className="w-1/5 text-right">{item.total} EUR</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-right">
                            <div className="text-lg font-semibold">
                                Total: {order.totalAmount} EUR
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
                            <div className="relative flex items-start">
                                <div className="h-7 w-7 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center flex-shrink-0 z-10">
                                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                                </div>
                                <div className="ml-4">
                                    <div className="font-medium">Order Placed</div>
                                    <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                                </div>
                            </div>

                            {order.orderStatus !== 'NEW' && (
                                <div className="relative flex items-start">
                                    <div className="h-7 w-7 rounded-full border-2 border-yellow-500 bg-white flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium">Processing</div>
                                        <div className="text-sm text-gray-500">Payment confirmed</div>
                                    </div>
                                </div>
                            )}

                            {(order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED') && (
                                <div className="relative flex items-start">
                                    <div className="h-7 w-7 rounded-full border-2 border-purple-500 bg-white flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium">Shipped</div>
                                        <div className="text-sm text-gray-500">Your order is on the way</div>
                                    </div>
                                </div>
                            )}

                            {order.orderStatus === 'DELIVERED' && (
                                <div className="relative flex items-start">
                                    <div className="h-7 w-7 rounded-full border-2 border-green-500 bg-white flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium">Delivered</div>
                                        <div className="text-sm text-gray-500">Order completed</div>
                                    </div>
                                </div>
                            )}

                            {order.orderStatus === 'CANCELLED' && (
                                <div className="relative flex items-start">
                                    <div className="h-7 w-7 rounded-full border-2 border-red-500 bg-white flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium">Cancelled</div>
                                        <div className="text-sm text-gray-500">Order was cancelled</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
                        <p className="text-gray-600 mb-4">
                            If you have any questions or concerns about your order, please contact our customer support team.
                        </p>
                        <a
                            href="mailto:support@shirtso.com"
                            className="text-blue-600 hover:underline block mb-2"
                        >
                            support@shirtso.com
                        </a>
                        <a
                            href="tel:+1234567890"
                            className="text-blue-600 hover:underline block"
                        >
                            +1 (234) 567-890
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;