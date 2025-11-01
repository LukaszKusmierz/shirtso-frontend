import Api from "./Api";

/**
 * Search for photos on Unsplash
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Results per page (default: 10, max: 30)
 * @returns {Promise} Search results
 */
export const searchPhotos = async (query, page = 1, perPage = 10) => {
    try {
        const data = await Api.get('/unsplash/search', {
            params: { query, page, perPage }
        });
        return data;
    } catch (error) {
        console.error('Failed to search photos:', error);
        throw error;
    }
};

/**
 * Get a random photo from Unsplash
 * @param {string} query - Optional search query to filter random photo
 * @returns {Promise} Random photo data
 */
export const getRandomPhoto = async (query = null) => {
    try {
        const data = await Api.get('/unsplash/random', {
            params: query ? { query } : {}
        });
        return data;
    } catch (error) {
        console.error('Failed to get random photo:', error);
        throw error;
    }
};

/**
 * Get photo details by ID
 * @param {string} photoId - Unsplash photo ID
 * @returns {Promise} Photo details
 */
export const getPhotoById = async (photoId) => {
    try {
        const data = await Api.get(`/unsplash/${photoId}`);
        return data;
    } catch (error) {
        console.error('Failed to get photo details:', error);
        throw error;
    }
};

/**
 * Download a photo (triggers download tracking)
 * @param {string} photoId - Unsplash photo ID
 * @returns {Promise} Download response
 */
export const downloadPhoto = async (photoId) => {
    try {
        const data = await Api.post(`/unsplash/${photoId}/download`);
        return data;
    } catch (error) {
        console.error('Failed to download photo:', error);
        throw error;
    }
};