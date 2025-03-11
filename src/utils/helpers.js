export const formatPrice = (price, currency) => {
    return `${price} ${currency}`;
};

export const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of stock', color: 'red' };
    if (stock < 3) return { text: 'Low stock', color: 'orange' };
    return { text: 'In stock', color: 'green' };
};