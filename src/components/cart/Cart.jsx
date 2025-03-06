import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import {Link, useNavigate} from "react-router-dom";
import CartItem from "./CartItem";

const Cart = () => {
    const {cartItems, totalPrice, clearCart} = useCart();
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=checkout');
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mb-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Cart Header */}
                <div className="px-6 py-4 border-b border-gray-200 hidden sm:flex text-sm text-gray-500">
                    <div className="w-24">Product</div>
                    <div className="flex-1 ml-4">Details</div>
                    <div className="w-32 text-right">Subtotal</div>
                </div>

                {/* Cart Items */}
                <div className="px-6 divide-y divide-gray-200">
                    {cartItems.map(item => (
                        <CartItem key={`${item.productId}-${item.size}`} item={item} />
                    ))}
                </div>

                {/* Cart Actions */}
                <div className="px-6 py-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <button
                            type="button"
                            onClick={clearCart}
                            className="text-sm text-red-600 hover:text-red-500 mb-4 sm:mb-0"
                        >
                            Clear Cart
                        </button>

                        <div className="text-right">
                            <p className="text-lg font-medium text-gray-900 mb-1">
                                Total: {totalPrice.toFixed(2)} {cartItems[0]?.currency || 'PLN'}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Taxes and shipping calculated at checkout
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                <Link
                                    to="/products"
                                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Continue Shopping
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
