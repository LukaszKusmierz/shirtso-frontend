/**
 * Formats a currency value
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (e.g., 'PLN', 'USD')
 * @param {string} locale - The locale for formatting (default: 'en-US')
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (value, currency = 'PLN', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

/**
 * Formats a date
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - The locale for formatting (default: 'en-US')
 * @returns {string} - The formatted date string
 */
export const formatDate = (date, options = {}, locale = 'en-US') => {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(
        typeof date === 'string' ? new Date(date) : date
    );
};

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @param {string} suffix - The suffix to append (default: '...')
 * @returns {string} - The truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
    if (!text || text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + suffix;
};

/**
 * Formats a number with thousands separators
 * @param {number} number - The number to format
 * @param {number} decimals - The number of decimal places (default: 0)
 * @param {string} locale - The locale for formatting (default: 'en-US')
 * @returns {string} - The formatted number
 */
export const formatNumber = (number, decimals = 0, locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};

/**
 * Creates a slug from a string
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')  // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
