import React from 'react';
import ProductManagement from '../../components/admin/ProductManagement';

const AdminProductsPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <ProductManagement />
        </div>
    );
};

export default AdminProductsPage;
