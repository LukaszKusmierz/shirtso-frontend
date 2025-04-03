import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Button from '../common/Button';

const CartSummary = ({ cart, onClearCart }) => {
    const navigate = useNavigate();
    if (!cart) return null;
    const { totalAmount, totalItems } = cart;
    const handleCheckout = () => {
        if (totalItems === 0) {
            return;
        }
        navigate('/checkout');
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between mb-2">
                    <span>Items ({totalItems}):</span>
                    <span>{totalAmount} PLN</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>
            </div>

            <div className="flex justify-between mb-4 font-semibold text-lg">
                <span>Total:</span>
                <span>{totalAmount} PLN</span>
            </div>

            <div className="space-y-3">
                <Button
                    variant="primary"
                    fullWidth={true}
                    onClick={handleCheckout}
                    disabled={totalItems === 0}
                >
                    Proceed to Checkout
                </Button>

                <Button
                    variant="outline"
                    fullWidth={true}
                    onClick={onClearCart}
                    disabled={totalItems === 0}
                >
                    Clear Cart
                </Button>

                <Link
                    to="/products"
                    className="block text-center text-blue-600 hover:text-blue-800"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
