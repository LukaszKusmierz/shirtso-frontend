import useCart from "../../hooks/useCart";
import {Link} from "react-router-dom";

const CartItem = ({item}) => {
    const {updateQuantity, removeFromCart} = useCart();

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);

        if (value > 0) {
            updateQuantity(item.productId, item.size, value);
        }
    };

    const incrementQuantity = () => {
        updateQuantity(item.productId, item.size, item.quantity + 1);
    };

    const decrementQuantity = () => {
        if (item.quantity >= 1) {
            updateQuantity(item.productId, item.size, item.quantity - 1);
        }
    };

    const handleRemove = () => {
        removeFromCart(item.productId, item.size);
    };

    const itemTotal = item.price * item.quantity;

    return (
        <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
            {/* Product Image */}
            <div className="sm:w-24 sm:h-24 h-32 w-full mb-4 sm:mb-0 bg-gray-200 rounded overflow-hidden">
                <Link to={`/products/${item.productId}`}>
                    <img
                        src={`/api/placeholder/${200}/${200}`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>

            {/* Product Details */}
            <div className="flex-1 sm:ml-4 flex flex-col sm:flex-row">
                <div className="flex-1">
                    <Link to={`/products/${item.productId}`} className="text-lg font-medium text-gray-800 hover:text-blue-600">
                        {item.productName}
                    </Link>

                    <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-500">Size: {item.size}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-500">Price: {item.price.toFixed(2)} {item.currency}</span>
                    </div>
                </div>

                {/* Quantity and Actions */}
                <div className="mt-4 sm:mt-0 flex items-center">
                    <div className="flex items-center border border-gray-300 rounded">
                        <button
                            type="button"
                            onClick={decrementQuantity}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            className="w-12 text-center border-none focus:ring-0"
                        />
                        <button
                            type="button"
                            onClick={incrementQuantity}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                        >
                            +
                        </button>
                    </div>

                    <div className="ml-4 sm:ml-6 sm:w-20 text-right">
                        <p className="text-lg font-medium text-gray-900">
                            {itemTotal.toFixed(2)} {item.currency}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="ml-4 text-gray-400 hover:text-red-500"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
