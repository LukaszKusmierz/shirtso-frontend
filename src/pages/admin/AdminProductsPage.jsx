import React from 'react';
import ProductImageManagement from '../../components/admin/ProductImageManagement';

const AdminProductsPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <ProductImageManagement />
        </div>
    );
};

export default AdminProductsPage;
