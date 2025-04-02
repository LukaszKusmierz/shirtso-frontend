const CartEventService = {
    listeners: [],

    subscribe: (callback) => {
        CartEventService.listeners.push(callback);
        return () => {
            CartEventService.listeners = CartEventService.listeners.filter(cb => cb !== callback);
        };
    },
    emitCartChange: () => {
        CartEventService.listeners.forEach(callback => callback());
    }
};

export default CartEventService;