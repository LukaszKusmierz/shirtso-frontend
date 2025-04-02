import React, { useState } from 'react';
import { validatePromoCode } from '../../services/PromoCodeService';
import Button from '../common/Button';
import Alert from '../common/Alert';

const PromoCodeInput = ({ orderValue, onPromoCodeApplied }) => {
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleApplyPromoCode = async (e) => {
        e.preventDefault();

        if (!promoCode.trim()) {
            setError('Please enter a promo code');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await validatePromoCode(promoCode, orderValue);

            if (result.valid) {
                setSuccess(`Promo code applied: ${result.message}`);
                onPromoCodeApplied(result.promoCode, result.discountAmount);
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Failed to validate promo code:', err);
            setError('Failed to validate promo code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Promo Code</h3>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-2"
                />
            )}

            {success && (
                <Alert
                    type="success"
                    message={success}
                    dismissible={true}
                    onDismiss={() => setSuccess(null)}
                    className="mb-2"
                />
            )}

            <form onSubmit={handleApplyPromoCode} className="flex items-center">
                <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l"
                />
                <Button
                    type="submit"
                    variant="primary"
                    className="rounded-l-none"
                    disabled={loading || !promoCode.trim()}
                    loading={loading}
                >
                    Apply
                </Button>
            </form>
        </div>
    );
};

export default PromoCodeInput;
