import React, { useState, useEffect } from 'react';
import { getUserAddresses, getDefaultAddress } from '../../services/AddressService';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

const AddressSelector = ({ onAddressSelected, onNewAddressClick }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setLoading(true);
                const addressList = await getUserAddresses();
                setAddresses(addressList);

                try {
                    const defaultAddress = await getDefaultAddress();
                    if (defaultAddress) {
                        setSelectedAddressId(defaultAddress.addressId);
                        onAddressSelected(defaultAddress);
                    } else if (addressList.length > 0) {
                        setSelectedAddressId(addressList[0].addressId);
                        onAddressSelected(addressList[0]);
                    }
                } catch (err) {
                    if (addressList.length > 0) {
                        setSelectedAddressId(addressList[0].addressId);
                        onAddressSelected(addressList[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch addresses:', err);
                setError('Failed to load your saved addresses');
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); //intentionally omitted dep(caused infinite loop)

    const handleAddressChange = (e) => {
        const addressId = parseInt(e.target.value);
        setSelectedAddressId(addressId);

        const selectedAddress = addresses.find(address => address.addressId === addressId);
        if (selectedAddress) {
            onAddressSelected(selectedAddress);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <Spinner size="md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 py-2">
                {error}
            </div>
        );
    }

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Shipping Address</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNewAddressClick}
                >
                    Add New Address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-gray-600 py-2">
                    No saved addresses found. Please add a new shipping address.
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <label key={address.addressId} className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                name="shippingAddress"
                                value={address.addressId}
                                checked={selectedAddressId === address.addressId}
                                onChange={handleAddressChange}
                                className="mt-1 h-4 w-4 text-blue-600"
                            />
                            <div className="ml-3">
                                <div className="font-medium">{address.fullName}</div>
                                <p className="text-sm text-gray-600">
                                    {address.streetAddress}, {address.city}, {address.postalCode}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {address.country}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {address.phone}
                                </p>
                                {address.isDefault && (
                                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                        Default
                                    </span>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressSelector;
