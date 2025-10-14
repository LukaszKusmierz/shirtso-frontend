// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/UseAuth';
import { getCart } from '../services/CartService';
import CartEventService from '../services/CartEventService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(
        localStorage.getItem('hasCartInteraction') === 'true'
    );
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchCart = async () => {
            if (!currentUser || (!hasInteracted && !localStorage.getItem('hasCartInteraction'))) {
                setCartItems(0);
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
        };

        if (hasInteracted) {
            fetchCart();
        }

        const unsubscribe = CartEventService.subscribe(() => {
            localStorage.setItem('hasCartInteraction', 'true');
            setHasInteracted(true);
            fetchCart();
        });

        return () => unsubscribe();
    }, [currentUser, hasInteracted]);

    return (
        <CartContext.Provider value={{ cartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);