import React, { useState, useEffect } from 'react';
import { getActiveShippingMethods } from '../../services/ShippingMethodService';
import Spinner from '../common/Spinner';

const ShippingMethodSelector = ({ onShippingMethodSelected }) => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedMethodId, setSelectedMethodId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                setLoading(true);
                const methods = await getActiveShippingMethods();
                setShippingMethods(methods);

                if (methods.length > 0) {
                    setSelectedMethodId(methods[0].shippingMethodId);
                    onShippingMethodSelected(methods[0]);
                }
            } catch (err) {
                console.error('Failed to fetch shipping methods:', err);
                setError('Failed to load shipping methods');
            } finally {
                setLoading(false);
            }
        };

        fetchShippingMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); //intentionally omitted dep(caused infinite loop)
    const handleMethodChange = (e) => {
        const methodId = parseInt(e.target.value);
        setSelectedMethodId(methodId);

        const selectedMethod = shippingMethods.find(method => method.shippingMethodId === methodId);
        if (selectedMethod) {
            onShippingMethodSelected(selectedMethod);
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
                {error}. Using standard shipping instead.
            </div>
        );
    }
    if (shippingMethods.length === 0) {
        return (
            <div className="text-gray-600 py-2">
                No shipping methods available. Using standard shipping instead.
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Shipping Method</h3>
            <div className="space-y-3">
                {shippingMethods.map((method) => (
                    <label key={method.shippingMethodId} className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="shippingMethod"
                            value={method.shippingMethodId}
                            checked={selectedMethodId === method.shippingMethodId}
                            onChange={handleMethodChange}
                            className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div className="ml-3">
                            <div className="flex justify-between w-full">
                                <span className="font-medium">{method.name}</span>
                                <span className="font-medium">{method.price} PLN</span>
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            <p className="text-sm text-gray-600">
                                Estimated delivery: {method.estimatedDeliveryDays} days
                            </p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ShippingMethodSelector;
