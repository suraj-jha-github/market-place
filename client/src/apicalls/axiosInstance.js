import axios from "axios";

export const axiosInstance = axios.create({
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

// Request interceptor to always include the latest token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle JWT expiration globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Check if the error is due to JWT expiration
        if (error.response && error.response.status === 401) {
            // Try to refresh the token first
            try {
                const { RefreshToken } = await import('./users');
                const refreshResponse = await RefreshToken();
                
                if (refreshResponse.success) {
                    // Update the token in localStorage
                    localStorage.setItem('token', refreshResponse.data);
                    
                    // Retry the original request
                    const originalRequest = error.config;
                    originalRequest.headers.authorization = `Bearer ${refreshResponse.data}`;
                    return axiosInstance(originalRequest);
                } else {
                    // If refresh fails, logout the user
                    handleLogout();
                }
            } catch (refreshError) {
                // If refresh fails, logout the user
                handleLogout();
            }
        }
        return Promise.reject(error);
    }
);

// Helper function to handle logout
const handleLogout = () => {
    // Clear the expired token
    localStorage.removeItem('token');
    
    // Only show one error message and redirect to login
    if (!window.jwtExpiredHandled) {
        window.jwtExpiredHandled = true;
        setTimeout(() => {
            window.jwtExpiredHandled = false;
        }, 1000);
        
        // Show error message only once
        if (window.antd && window.antd.message) {
            window.antd.message.error('Session expired. Please login again.');
        }
        
        // Redirect to login page
        window.location.href = '/login';
    }
};