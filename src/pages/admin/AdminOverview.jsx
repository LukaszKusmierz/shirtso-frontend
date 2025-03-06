import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, trend, linkTo }) => {
    return (
        <Link to={linkTo} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>

                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${
                            trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            <svg
                                className={`w-4 h-4 mr-1 ${trend > 0 ? 'transform rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span>{Math.abs(trend)}% from last month</span>
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 p-3 rounded-full">
                    {icon}
                </div>
            </div>
        </Link>
    );
};

const ChartCard = ({ title, children }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
            <div className="h-64 border-t border-gray-200 pt-4">
                {children}
            </div>
        </div>
    );
};

const LowStockProductsTable = ({ products }) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Low Stock Products</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={`${product.productId}-${product.size}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                                        <div className="h-10 w-10 rounded flex items-center justify-center text-gray-500">
                                            {product.imageId}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.productName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            ID: {product.productId.substring(0, 8)}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 3
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/admin/products/edit/${product.productId}`} className="text-blue-600 hover:text-blue-900">
                                    Update Stock
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        revenue: 0
    });

    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Here you would normally fetch data from your API
                // For demonstration, we'll set mock data after a delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                setStats({
                    totalProducts: 28,
                    totalCategories: 8,
                    totalOrders: 154,
                    revenue: 45678.99
                });

                setLowStockProducts([
                    {
                        productId: '9b8f7e6d-5c4b-3a2d-1e0f-9a8b7c6d5e4f',
                        productName: 'Marynarka',
                        size: 'M',
                        stock: 0,
                        imageId: 311
                    },
                    {
                        productId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
                        productName: 'Płaszcz',
                        size: 'XS',
                        stock: 0,
                        imageId: 49
                    },
                    {
                        productId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
                        productName: 'Jeansy',
                        size: 'XXXL',
                        stock: 2,
                        imageId: 112
                    },
                    {
                        productId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
                        productName: 'Marynarka',
                        size: 'XXL',
                        stock: 1,
                        imageId: 308
                    },
                    {
                        productId: 'z1x2c3v4-b5n6-m7k8-j9h0-g1f2d3s4a5p6',
                        productName: 'Marynarka',
                        size: 'XS',
                        stock: 1,
                        imageId: 313
                    }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    trend={5.2}
                    linkTo="/admin/products"
                    icon={
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    }
                />

                <StatCard
                    title="Categories"
                    value={stats.totalCategories}
                    linkTo="/admin/categories"
                    icon={
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    }
                />

                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    trend={12.3}
                    linkTo="/admin/orders"
                    icon={
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    }
                />

                <StatCard
                    title="Revenue"
                    value={`${stats.revenue.toLocaleString()} PLN`}
                    trend={3.7}
                    linkTo="/admin/orders"
                    icon={
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Monthly Sales">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded">
                        <p className="text-gray-500">Sales chart visualization would go here</p>
                    </div>
                </ChartCard>

                <ChartCard title="Top Categories">
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded">
                        <p className="text-gray-500">Categories chart visualization would go here</p>
                    </div>
                </ChartCard>
            </div>

            {/* Low Stock Products */}
            <LowStockProductsTable products={lowStockProducts} />
        </div>
    );
};

export default AdminOverview;
