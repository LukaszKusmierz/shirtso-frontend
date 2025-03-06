/**
 * Validates if a string is empty
 * @param {string} value - The value to check
 * @returns {boolean} - True if the value is not empty
 */
export const isNotEmpty = (value) => {
    return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validates if a string meets minimum length requirement
 * @param {string} value - The value to check
 * @param {number} minLength - The minimum length required
 * @returns {boolean} - True if the value meets or exceeds minimum length
 */
export const minLength = (value, minLength) => {
    return value && value.length >= minLength;
};

/**
 * Validates if a string meets maximum length requirement
 * @param {string} value - The value to check
 * @param {number} maxLength - The maximum length allowed
 * @returns {boolean} - True if the value is within maximum length
 */
export const maxLength = (value, maxLength) => {
    return !value || value.length <= maxLength;
};

/**
 * Validates if a string is a valid email address
 * @param {string} value - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export const isEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
};

/**
 * Validates if a value is a number
 * @param {any} value - The value to check
 * @returns {boolean} - True if the value is a number
 */
export const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validates if a number is positive
 * @param {number|string} value - The value to check
 * @returns {boolean} - True if the value is a positive number
 */
export const isPositive = (value) => {
    return isNumber(value) && parseFloat(value) > 0;
};

/**
 * Validates if a number is non-negative
 * @param {number|string} value - The value to check
 * @returns {boolean} - True if the value is a non-negative number
 */
export const isNonNegative = (value) => {
    return isNumber(value) && parseFloat(value) >= 0;
};

/**
 * Validates if a string matches a regex pattern
 * @param {string} value - The value to check
 * @param {RegExp} pattern - The regex pattern to match
 * @returns {boolean} - True if the value matches the pattern
 */
export const matchesPattern = (value, pattern) => {
    return pattern.test(value);
};

/**
 * Validates if two values match (e.g., for password confirmation)
 * @param {any} value1 - The first value
 * @param {any} value2 - The second value
 * @returns {boolean} - True if the values match
 */
export const valuesMatch = (value1, value2) => {
    return value1 === value2;
};

/**
 * Validates if a value is one of an allowed list of values
 * @param {any} value - The value to check
 * @param {Array} allowedValues - The allowed values
 * @returns {boolean} - True if the value is in the allowed list
 */
export const isOneOf = (value, allowedValues) => {
    return allowedValues.includes(value);
};

/**
 * Runs multiple validations and returns the first error message
 * @param {any} value - The value to validate
 * @param {Array} validations - Array of validation objects with {validator, message}
 * @returns {string|null} - The first error message or null if all valid
 */
export const runValidations = (value, validations) => {
    for (const validation of validations) {
        const isValid = validation.validator(value);
        if (!isValid) {
            return validation.message;
        }
    }
    return null;
};

/**
 * Form validation helper that takes a validation schema and returns errors
 * @param {Object} values - The form values
 * @param {Object} schema - The validation schema
 * @returns {Object} - The validation errors
 *
 * Example:
 * const schema = {
 *   username: [
 *     { validator: isNotEmpty, message: 'Username is required' },
 *     { validator: (v) => minLength(v, 3), message: 'Username must be at least 3 characters' }
 *   ],
 *   email: [
 *     { validator: isNotEmpty, message: 'Email is required' },
 *     { validator: isEmail, message: 'Email is invalid' }
 *   ]
 * };
 *
 * const errors = validateForm(formValues, schema);
 */
export const validateForm = (values, schema) => {
    const errors = {};

    Object.keys(schema).forEach(fieldName => {
        const value = values[fieldName];
        const fieldValidations = schema[fieldName];
        const error = runValidations(value, fieldValidations);

        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};
