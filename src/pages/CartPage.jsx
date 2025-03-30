import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../services/CartService';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        const fetchCart = async () => {
            setLoading(true);
            try {
                const cartData = await getCart();
                setCart(cartData);
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

    const handleUpdateQuantity = async (cartItemId, quantity) => {
        try {
            const updatedCart = await updateCartItem(cartItemId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to update cart:', err);
            setError('Failed to update item quantity. Please try again.');
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            const updatedCart = await removeCartItem(cartItemId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to remove item:', err);
            setError('Failed to remove item from cart. Please try again.');
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart();
                const emptyCart = await getCart();
                setCart(emptyCart);
            } catch (err) {
                console.error('Failed to clear cart:', err);
                setError('Failed to clear your cart. Please try again.');
            }
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
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    dismissible={true}
                    onDismiss={() => setError(null)}
                    className="mb-4"
                />
            )}

            {cart && cart.items && cart.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Cart Items ({cart.totalItems})</h2>
                            <div className="divide-y">
                                {cart.items.map((item) => (
                                    <CartItem
                                        key={item.cartItemId}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <CartSummary cart={cart} onClearCart={handleClearCart} />
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                    <p className="mb-6 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
                    <a
                        href="/products"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Start Shopping
                    </a>
                </div>
            )}
        </div>
    );
};

export default CartPage;
