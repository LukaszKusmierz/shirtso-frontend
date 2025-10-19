import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import Alert from '../common/Alert';
import Button from '../common/Button';

const UserProfile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!currentUser) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500">Please log in to view your profile.</p>
            </div>
        );
    }
    const { userId, userName, email, roles = [] } = currentUser;
    const formatRoles = (roles) => {
        if (!roles || roles.length === 0) return 'No roles assigned';

        return roles.map(role => {
            switch(role) {
                case 'USER_READ':
                    return 'Customer';
                case 'USER_WRITE':
                    return 'Administrator';
                default:
                    return role;
            }
        }).join(', ');
    };
    const isAdmin = roles.includes('USER_WRITE');

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
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

            <h2 className="text-xl font-semibold mb-6">User Profile</h2>

            <div className="mb-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                    <p className="mt-1 text-lg">{userId}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p className="mt-1 text-lg">{userName}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg">{email}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1 text-lg">{formatRoles(roles)}</p>
                </div>
            </div>

            {isAdmin && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-700 mb-2">Administrator Account</h3>
                    <p className="text-blue-600 mb-4">
                        You have administrative privileges and can access the admin dashboard.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/admin/products'}
                    >
                        Go to Admin Dashboard
                    </Button>
                </div>
            )}

            <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Account Actions</h3>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => navigate('/change-password')}
                    >
                        Change Password
                    </Button>

                    <Button
                        variant="danger"
                        fullWidth
                    >
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
