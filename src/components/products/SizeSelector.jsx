import React from 'react';
import { getAllSizes } from '../../utils/sizes';

/**
 * Size selector component for product sizing
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Currently selected size
 * @param {Function} props.onChange - Handler called when size selection changes
 * @param {Array<string>} [props.sizes] - Optional custom sizes to display (defaults to all available sizes)
 * @returns {JSX.Element} Size selector component
 */
const SizeSelector = ({ value, onChange, sizes = getAllSizes() }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
                <button
                    key={size}
                    type="button"
                    onClick={() => onChange(size)}
                    className={`px-3 py-1 text-sm border rounded ${
                        value === size
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {size}
                </button>
            ))}
        </div>
    );
};

export default SizeSelector;
