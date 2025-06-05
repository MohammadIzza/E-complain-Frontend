/**
 * File: helpers/errorHelper.js
 * Deskripsi: Helper function untuk menangani error dari API
 * Fungsi: Mengubah error response menjadi pesan yang mudah dipahami
 */

/**
 * Fungsi untuk menangani error dari API
 * @param {Error} error - Error object dari Axios
 * @returns {string|object} - Pesan error yang sudah diformat
 */
export const handleError = (error) => {
    // Error koneksi jaringan
    if (!error.response) {
        return 'Network error. Please check your connection.'
    }

    // Error validasi (422 Unprocessable Entity)
    // Biasanya terjadi ketika data yang dikirim tidak valid
    if (error.response.status === 422) {
        return error.response.data.errors
    }

    // Error autentikasi (401 Unauthorized)
    // Terjadi ketika token tidak valid atau expired
    if (error.response.status === 401) {
        return 'Your session has expired. Please login again.'
    }

    // Error akses (403 Forbidden)
    // Terjadi ketika user tidak memiliki izin
    if (error.response.status === 403) {
        return 'You do not have permission to perform this action.'
    }

    // Error server (500 Internal Server Error)
    // Terjadi ketika ada masalah di server
    if (error.response.status >= 500) {
        return 'Server error. Please try again later.'
    }

    // Pesan error default
    // Menggunakan pesan dari server jika ada, atau pesan default
    return error.response.data.message || 'An error occurred. Please try again.'
}
