/**
 * Validation utilities for form data
 */

// Regex patterns
export const VALIDATION_PATTERNS = {
    EMAIL_GMAIL: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    PHONE_VN: /^0\d{9}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,}$/,
};

/**
 * Validate signup form data
 * @param {Object} userData - User data to validate
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.phone - Phone number
 * @param {string} userData.password - Password
 * @param {string} userData.fullName - Full name
 * @returns {Array} Array of error messages
 */
export const validateSignupData = (userData) => {
    const errors = [];

    // Kiểm tra username (không rỗng, ít nhất 3 ký tự, chỉ chứa chữ, số, _)
    if (!userData.username || userData.username.trim().length < 3) {
        errors.push('Username phải có ít nhất 3 ký tự');
    } else if (!VALIDATION_PATTERNS.USERNAME.test(userData.username)) {
        errors.push('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
    }

    // Kiểm tra email định dạng @gmail.com
    if (!userData.email || !VALIDATION_PATTERNS.EMAIL_GMAIL.test(userData.email)) {
        errors.push('Email phải có định dạng @gmail.com');
    }

    // Kiểm tra số điện thoại (bắt đầu bằng 0 và có đúng 10 số)
    if (!userData.phone || !VALIDATION_PATTERNS.PHONE_VN.test(userData.phone)) {
        errors.push('Số điện thoại phải bắt đầu bằng 0 và có đúng 10 số');
    }

    // Kiểm tra mật khẩu (ít nhất 6 ký tự)
    if (!userData.password || userData.password.length < 6) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    // Kiểm tra họ tên (không rỗng)
    if (!userData.fullName || userData.fullName.trim().length < 2) {
        errors.push('Họ tên phải có ít nhất 2 ký tự');
    }

    // Kiểm tra tuổi (phải là số và trong khoảng hợp lệ)
    const age = parseInt(userData.age);
    if (!userData.age || isNaN(age) || age < 1 || age > 120) {
        errors.push('Tuổi phải là số từ 1 đến 120');
    }

    return errors;
};

/**
 * Validate signin form data
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Array} Array of error messages
 */
export const validateSigninData = (credentials) => {
    const errors = [];

    if (!credentials.username || credentials.username.trim().length === 0) {
        errors.push('Username không được để trống');
    }

    if (!credentials.password || credentials.password.length === 0) {
        errors.push('Mật khẩu không được để trống');
    }

    return errors;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid Gmail format
 */
export const isValidGmailEmail = (email) => {
    return VALIDATION_PATTERNS.EMAIL_GMAIL.test(email);
};

/**
 * Validate Vietnamese phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Vietnamese phone format
 */
export const isValidVietnamesePhone = (phone) => {
    return VALIDATION_PATTERNS.PHONE_VN.test(phone);
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid username format
 */
export const isValidUsername = (username) => {
    return username && username.length >= 3 && VALIDATION_PATTERNS.USERNAME.test(username);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength level
 */
export const validatePasswordStrength = (password) => {
    const result = {
        isValid: false,
        strength: 'weak',
        errors: []
    };

    if (!password) {
        result.errors.push('Mật khẩu không được để trống');
        return result;
    }

    if (password.length < 6) {
        result.errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    if (password.length >= 6) {
        result.isValid = true;
        result.strength = 'medium';
    }

    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        result.strength = 'strong';
    }

    return result;
};

/**
 * Clean and format phone number
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as 0xxx-xxx-xxx
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return cleaned;
};

/**
 * Generate validation summary
 * @param {Array} errors - Array of error messages
 * @returns {string} Formatted error message
 */
export const getValidationSummary = (errors) => {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0];
    return `Có ${errors.length} lỗi: ${errors.join(', ')}`;
};
