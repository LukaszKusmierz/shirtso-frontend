export const SIZES = {
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL',
    XXL: 'XXL',
    XXXL: 'XXXL'
};

/**
 * Get all available product sizes as an array
 * @returns {Array<string>} Array of available sizes
 */
export const getAllSizes = () => Object.values(SIZES);

/**
 * Get all available product sizes with labels
 * Useful for displaying in dropdowns, etc.
 * @returns {Array<{value: string, label: string}>} Array of size objects
 */
export const getSizesWithLabels = () => {
    return getAllSizes().map(size => ({
        value: size,
        label: size
    }));
};
