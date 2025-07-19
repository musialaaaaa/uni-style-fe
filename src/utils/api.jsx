// utils/api.js - API helper functions

const API_BASE_URL = 'http://localhost:8080';

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'accept': '*/*',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: getAuthHeaders(),
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// Authentication API calls
export const authAPI = {
    // Login
    login: async (username, password) => {
        return apiCall('/auth/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    // Register (if you have this endpoint)
    register: async (userData) => {
        return apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Refresh token
    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        return apiCall('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        });
    },

    // Logout
    logout: async () => {
        return apiCall('/auth/logout', {
            method: 'POST'
        });
    }
};

// Product API calls
export const productAPI = {
    // Get all products
    getProducts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/products${queryString ? `?${queryString}` : ''}`);
    },

    // Get product by ID
    getProduct: async (id) => {
        return apiCall(`/products/${id}`);
    },

    // Create product
    createProduct: async (productData) => {
        return apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },

    // Update product
    updateProduct: async (id, productData) => {
        return apiCall(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    // Delete product
    deleteProduct: async (id) => {
        return apiCall(`/products/${id}`, {
            method: 'DELETE'
        });
    }
};

// Category API calls
export const categoryAPI = {
    getCategories: async () => {
        return apiCall('/categories');
    },

    createCategory: async (categoryData) => {
        return apiCall('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    }
};

// Brand API calls
export const brandAPI = {
    getBrands: async () => {
        return apiCall('/brands');
    },

    createBrand: async (brandData) => {
        return apiCall('/brands', {
            method: 'POST',
            body: JSON.stringify(brandData)
        });
    }
};

// User API calls
export const userAPI = {
    // Get current user info
    getCurrentUser: async () => {
        return apiCall('/users/me');
    },

    // Update user profile
    updateProfile: async (userData) => {
        return apiCall('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        return apiCall('/users/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }
};

// Error handler for token expiration
export const handleApiError = (error, onLogout) => {
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        // Token expired or invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (onLogout) onLogout();
    }
    throw error;
};

// Auto retry with refresh token
export const apiCallWithRefresh = async (endpoint, options = {}, onLogout) => {
    try {
        return await apiCall(endpoint, options);
    } catch (error) {
        if (error.message.includes('401')) {
            try {
                // Try to refresh token
                const refreshResponse = await authAPI.refreshToken();
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);

                // Retry original request with new token
                return await apiCall(endpoint, options);
            } catch (refreshError) {
                // Refresh failed, logout user
                handleApiError(refreshError, onLogout);
            }
        }
        throw error;
    }
};

export default {
    authAPI,
    productAPI,
    categoryAPI,
    brandAPI,
    userAPI,
    apiCall,
    apiCallWithRefresh,
    handleApiError
};