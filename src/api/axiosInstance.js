import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://workintech-fe-ecommerce.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Response interceptor ───────────────────────────────────────────────────
// On 401 (outside of /login itself), the token is no longer valid:
//   • remove it from localStorage
//   • remove it from the axios default header
//   • redirect to /login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401      = error.response?.status === 401;
    const isLoginReq = error.config?.url?.includes('/login');

    if (is401 && !isLoginReq) {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;