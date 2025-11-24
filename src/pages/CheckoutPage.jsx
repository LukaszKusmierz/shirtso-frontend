import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getCart } from '../services/CartService';
import { createOrder } from '../services/OrderService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import AddressSelector from '../components/checkout/AddressSelector';
import AddressForm from '../components/checkout/AddressForm';
import ShippingMethodSelector from '../components/checkout/ShippingMethodSelector';
import PromoCodeInput from '../components/checkout/PromoCodeInput';

const CheckoutPage = () => {
    const [cart, setCart] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
    const [appliedPromoCode, setAppliedPromoCode] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const subtotal = cart?.totalAmount || 0;
    const currency = cart?.items?.[0]?.product?.currency || '';
    const shippingCost = selectedShippingMethod?.price || 0;
    const discount = discountAmount || 0;
    const total = Math.round((subtotal + shippingCost - discount) * 100) / 100;
    const displayTotal = total.toFixed(2);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }
        const fetchCart = async () => {
            setLoading(true);
            try {
                const cartData = await getCart();
                setCart(cartData);

                if (!cartData || !cartData.items || cartData.items.length === 0) {
                    navigate('/cart');
                    return;
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch cart:', err);
                setError('Failed to load your shopping cart. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [currentUser, navigate]);
    const handleAddressSelected = useCallback((address) => {
        setSelectedAddress(address);
    }, []);
    const handleNewAddressCreated = useCallback((address) => {
        setSelectedAddress(address);
        setShowAddressForm(false);
    }, []);
    const handleShippingMethodSelected = useCallback((method) => {
        setSelectedShippingMethod(method);
    }, []);
    const handlePromoCodeApplied = useCallback((promoCode, discount) => {
        setAppliedPromoCode(promoCode);
        setDiscountAmount(discount);
    }, []);
    const validateCheckout = () => {
        if (!selectedAddress) {
            setError('Please select or add a shipping address');
            return false;
        }

        if (!selectedShippingMethod) {
            setError('Please select a shipping method');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCheckout()) return;
        setSubmitting(true);
        setError(null);

        try {
            const orderResponse = await createOrder(
                cart.cartId,
                selectedShippingMethod?.shippingMethodId,
                selectedAddress?.addressId,
                appliedPromoCode?.code
                );
            navigate(`/checkout/payment/${orderResponse.orderId}`, {
                state: {
                    subtotal,
                    shippingCost,
                    discount,
                    total,
                    shippingMethod: selectedShippingMethod,
                    address: selectedAddress,
                    promoCode: appliedPromoCode
                }
            });
        } catch (err) {
            console.error('Failed to create order:', err);
            setError('Failed to process your order. Please try again.');
            setSubmitting(false);
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {showAddressForm ? (
                            <AddressForm
                                onAddressCreated={handleNewAddressCreated}
                                onCancel={() => setShowAddressForm(false)}
                            />
                        ) : (
                            <AddressSelector
                                onAddressSelected={handleAddressSelected}
                                onNewAddressClick={() => setShowAddressForm(true)}
                            />
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <ShippingMethodSelector
                            onShippingMethodSelected={handleShippingMethodSelected}
                            currency={currency}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <PromoCodeInput
                            orderValue={subtotal}
                            onPromoCodeApplied={handlePromoCodeApplied}
                        />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        {cart && (
                            <>
                                <div className="border-t border-b py-4 mb-4">
                                    <div className="max-h-60 overflow-y-auto">
                                        {cart.items.map((item) => (
                                            <div key={item.cartItemId} className="flex justify-between py-2">
                                                <div>
                                                    <span className="font-medium">{item.product.productName}</span>
                                                    <span className="text-gray-600 block">Qty: {item.quantity}</span>
                                                </div>
                                                <span>{item.totalAmount} {currency}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between mt-4">
                                        <span>Items ({cart.totalItems}):</span>
                                        <span>{subtotal} {currency}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>{shippingCost > 0 ? `${shippingCost} ${currency}` : 'Free'}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount:</span>
                                            <span>-{discount} {currency}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-lg font-semibold mb-6">
                                    <span>Total:</span>
                                    <span>{displayTotal} {currency}</span>
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    fullWidth={true}
                                    disabled={submitting || !selectedAddress || !selectedShippingMethod}
                                    loading={submitting}
                                    onClick={handleSubmit}
                                >
                                    Proceed to Payment
                                </Button>

                                <div className="mt-4 text-center">
                                    <a
                                        href="/cart"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ← Back to Cart
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
