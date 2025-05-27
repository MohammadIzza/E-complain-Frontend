export const handleError = (error) => {
    // Network error
    if (!error.response) {
        return 'Network error. Please check your connection.'
    }

    // Validation errors
    if (error.response.status === 422) {
        return error.response.data.errors
    }

    // Authentication errors
    if (error.response.status === 401) {
        return 'Your session has expired. Please login again.'
    }

    // Forbidden errors
    if (error.response.status === 403) {
        return 'You do not have permission to perform this action.'
    }

    // Server errors
    if (error.response.status >= 500) {
        return 'Server error. Please try again later.'
    }

    // Default error message
    return error.response.data.message || 'An error occurred. Please try again.'
}
