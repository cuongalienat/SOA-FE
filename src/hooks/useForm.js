import { useState } from 'react';

/**
 * Custom hook for form management
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler function
 * @param {Function} validate - Validation function (optional)
 */
export const useForm = (initialValues, onSubmit, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Run validation if provided
        if (validate) {
            const validationErrors = validate(values);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    };

    // Set specific field value
    const setValue = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Set specific field error
    const setError = (name, error) => {
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
        setValue,
        setError
    };
};

/**
 * Custom hook for notification management
 */
export const useNotification = () => {
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const showNotification = (message, type = 'info') => {
        setNotification({
            isVisible: true,
            message,
            type
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            isVisible: false
        }));
    };

    const showSuccess = (message) => showNotification(message, 'success');
    const showError = (message) => showNotification(message, 'error');
    const showWarning = (message) => showNotification(message, 'warning');
    const showInfo = (message) => showNotification(message, 'info');

    return {
        notification,
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};
