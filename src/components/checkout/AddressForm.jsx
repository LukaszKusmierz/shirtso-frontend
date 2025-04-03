import React, { useState } from 'react';
import { createAddress } from '../../services/AddressService';
import Button from '../common/Button';
import Alert from '../common/Alert';

const AddressForm = ({ onAddressCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        isDefault: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const validateForm = () => {
        const requiredFields = ['fullName', 'streetAddress', 'city', 'postalCode', 'country', 'phone'];
        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                setError(`Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }
        const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid phone number');
            return false;
        }

        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const newAddress = await createAddress(formData);
            onAddressCreated(newAddress);
        } catch (err) {
            console.error('Failed to create address:', err);
            setError('Failed to save address. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Add New Address</h3>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
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
                            value={formData.phone}
                            onChange={handleChange}
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
                        value={formData.streetAddress}
                        onChange={handleChange}
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
                            value={formData.city}
                            onChange={handleChange}
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
                            value={formData.postalCode}
                            onChange={handleChange}
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
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Make this my default shipping address</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        loading={loading}
                    >
                        Save Address
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
