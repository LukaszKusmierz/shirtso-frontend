class ApiDebugger {
    /**
     * Log API request details
     * @param {string} endpoint - API endpoint
     * @param {Object} [data] - Request data
     * @param {Object} [config] - Request configuration
     */
    static logRequest(endpoint, data = null, config = {}) {
        console.group(`🚀 API Request: ${endpoint}`);
        console.log('URL:', endpoint);
        if (data) console.log('Data:', data);
        console.log('Headers:', config.headers || 'Default headers');
        console.groupEnd();
    }

    /**
     * Log API response
     * @param {string} endpoint - API endpoint
     * @param {Object} response - API response
     */
    static logResponse(endpoint, response) {
        console.group(`✅ API Response: ${endpoint}`);
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.groupEnd();
    }

    /**
     * Log API error
     * @param {string} endpoint - API endpoint
     * @param {Error} error - Error object
     */
    static logError(endpoint, error) {
        console.group(`❌ API Error: ${endpoint}`);
        console.error('Message:', error.message);

        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request made but no response received');
            console.error('Request:', error.request);
        } else {
            console.error('Error setting up request');
        }

        console.error('Config:', error.config);
        console.groupEnd();
    }

    /**
     * Test backend connectivity
     * @param {string} url - Base URL to test
     * @returns {Promise<boolean>} Connectivity status
     */
    static async testConnection(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, {
                method: 'OPTIONS',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.error(`Cannot connect to ${url}:`, error);
            return false;
        }
    }
}

export default ApiDebugger;
