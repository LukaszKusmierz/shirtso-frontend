import React from 'react';

const SizeSelector = ({ value, onChange, sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] }) => {
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
