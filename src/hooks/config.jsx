import axios from 'axios';

// Sử dụng biến môi trường hoặc URL mặc định
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
console.log("API Base URL:", BASE_URL);

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 1,
    },
    timeout: 10000, // Thêm timeout để tránh request quá lâu
});

// Request interceptor để thêm token vào mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor để xử lý lỗi 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.log(originalRequest);

    // Nếu lỗi 401 và chưa thử refresh token
    console.log("response error:", error.response);

    if ([401].includes(error.response?.status) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error.response);
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Lưu token mới
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Cập nhật header và thử lại request ban đầu
        api.defaults.headers.Authorization = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout user hoặc xử lý theo cách khác
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Chuyển hướng đến trang đăng nhập hoặc hiển thị lỗi
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Export the configured API instance
export { api };

// Alternatively, you could use a default export:
// export default api;