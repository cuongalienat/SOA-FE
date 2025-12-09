/**
 * Authentication utilities
 */

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * Save auth data to localStorage
 * @param {Object} authData - Auth data containing token and user
 */
export const saveAuthData = (authData) => {
    if (authData.token) {
        localStorage.setItem('token', authData.token);
    }
    if (authData.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
    }
};

/**
 * Check if token is expired (basic check)
 * @param {string} token - JWT token
 * @returns {boolean} True if token appears expired
 */
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

/**
 * Get user role from token or user data
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
    const user = getCurrentUser();
    return user?.role || null;
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (role) => {
    const userRole = getUserRole();
    return userRole === role;
};

/**
 * Generate auth headers for API requests
 * @returns {Object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
