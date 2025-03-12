export const formatPrice = (price, currency) => {
    return `${price} ${currency}`;
};

export const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of stock', color: 'red' };
    if (stock < 3) return { text: 'Low stock', color: 'orange' };
    return { text: 'In stock', color: 'green' };
};

export const getStockStatusColor = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
};