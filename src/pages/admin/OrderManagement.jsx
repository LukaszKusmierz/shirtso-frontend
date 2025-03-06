import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Simulate API call to fetch orders
                await new Promise(resolve => setTimeout(resolve, 1000));

                setOrders([
                    {
                        id: '12345',
                        date: '2023-11-15',
                        customer: 'Jan Kowalski',
                        email: 'jan@example.com',
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
                        date: '2023-11-05',
                        customer: 'Tomasz Nowak',
                        email: 'tomasz@example.com',
                        status: 'Processing',
                        total: 519.99,
                        items: [
                            { name: 'Jeansy', size: 'M', quantity: 1, price: 519.99 }
                        ]
                    },
                    {
                        id: '12343',
                        date: '2023-10-28',
                        customer: 'Marta Wiśniewska',
                        email: 'marta@example.com',
                        status: 'Shipped',
                        total: 1189.97,
                        items: [
                            { name: 'Płaszcz', size: 'S', quantity: 1, price: 1119.99 },
                            { name: 'Sweter', size: 'S', quantity: 1, price: 119.99 }
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

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'Shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">Order Management</h3>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                    <div className="flex items-center space-x-3">
                        <select className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                    <div className="text-sm text-gray-500">{order.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.total.toFixed(2)} PLN
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
