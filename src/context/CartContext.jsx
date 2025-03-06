import {createContext, useEffect, useState} from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const storedCart = localStorage.getItem("shirtso-cart");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error('Failed to parse cart from localStorage', error);
                setCartItems([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("shirtso-cart", JSON.stringify(cartItems));

        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        setTotalItems(itemCount);
        setTotalPrice(itemsPrice);
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.productId === product.productId && item.size === product.size
            );

            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity
                };
                return updatedItems;
            }else {
                return [...prevItems, {...product, quantity}];
            }
        });
    };

    const  removeFromCart = (productId, size) => {
        setCartItems(prevItems => {
            prevItems.filter(item => !(item.productId === productId && item.size === size));
        });
    };

    const updateQuantity = (productId, size, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId && item.size === size
                    ? {...item, quantity}
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const contextValue = {
        cartItems,
        totalPrice,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
