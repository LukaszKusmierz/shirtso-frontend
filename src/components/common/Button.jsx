import React from 'react';

const Button = ({
                    children,
                    type = 'button',
                    variant = 'primary',
                    size = 'md',
                    fullWidth = false,
                    disabled = false,
                    loading = false,
                    onClick,
                    className = '',
                    ...rest
                }) => {

    const baseClasses = 'font-medium rounded focus:outline-none transition-colors';
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };
    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50',
    };
    const stateClasses = {
        disabled: 'opacity-50 cursor-not-allowed',
        loading: 'relative !text-transparent',
    };
    const widthClass = fullWidth ? 'w-full' : '';
    const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${disabled ? stateClasses.disabled : ''}
    ${loading ? stateClasses.loading : ''}
    ${widthClass}
    ${className}
  `;

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...rest}
        >
            {children}

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="animate-spin h-5 w-5 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}
        </button>
    );
};

export default Button;