/**
 * Decodes a JWT token to get its payload
 * @param {string} token - The JWT token
 * @returns {Object|null} The decoded payload or null if invalid
 */
export const decodeJwtToken = (token) => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};

/**
 * Checks if a JWT token is expired
 * @param {string} token - The JWT token
 * @returns {boolean} True if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token) => {
    const payload = decodeJwtToken(token);
    if (!payload || !payload.exp) return true;
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
};

/**
 * Gets the username from a JWT token
 * @param {string} token - The JWT token
 * @returns {string|null} The username or null if token is invalid
 */
export const getUsernameFromToken = (token) => {
    const payload = decodeJwtToken(token);
    return payload ? payload.sub : null;
};

/**
 * Gets user roles from JWT token
 * @param {string} token - The JWT token
 * @returns {Array|null} Array of roles or null if token is invalid
 */
export const getRolesFromToken = (token) => {
    const payload = decodeJwtToken(token);
    return payload ? payload.roles || [] : null;
};

// export const getEmailFromToken = (token) => {
//     const payload = decodeJwtToken(token);
//     return payload ? payload.email : null;
// }