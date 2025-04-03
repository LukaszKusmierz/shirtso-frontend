import React, {useState, useEffect, useCallback} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { getCart } from '../../services/CartService';
import CartEventService from "../../services/CartEventService";

const CartIcon = () => {
    const [cartItems, setCartItems] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(
        localStorage.getItem('hasCartInteraction') === 'true'
    );
    const { currentUser } = useAuth();
    const fetchCartItems = useCallback(async () => {
        if (!currentUser) {
            setCartItems(0);
            return;
        }
        if (!hasInteracted && !localStorage.getItem('hasCartInteraction')) {
            return;
        }

        try {
            const cart = await getCart();
            setCartItems(cart.totalItems || 0);
            if (cart.totalItems > 0 && !hasInteracted) {
                localStorage.setItem('hasCartInteraction', 'true');
                setHasInteracted(true);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        }
    }, [currentUser, hasInteracted]);

    useEffect(() => {
        if (hasInteracted) {
            fetchCartItems();
        }

        const unsubscribe = CartEventService.subscribe(() => {
            localStorage.setItem('hasCartInteraction', 'true');
            setHasInteracted(true);
            fetchCartItems();
        });

        return () => {
            unsubscribe();
        };
    }, [fetchCartItems, hasInteracted]);

    return (
        <Link to="/cart" className="relative inline-flex items-center p-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            {cartItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {cartItems}
        </span>
            )}
        </Link>
    );
};

export default CartIcon;
