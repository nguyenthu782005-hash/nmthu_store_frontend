import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthService = {
  // Matching CSharp: [HttpPost("login")] Login(string email, string password)
  login: (credentials) => api.post(`/Users/login?email=${credentials.email}&password=${credentials.password}`),
  register: (userData) => api.post('/Users/register', userData),
  getById: (id) => api.get(`/Users/${id}`),
  forgotPassword: (email) => api.post('/Users/forgot-password', { email }),
  resetPassword: (data) => api.post('/Users/reset-password', data),
  update: (id, userData) => api.put(`/Users/${id}`, userData),
};

export const ProductService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

export const CategoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export const CouponService = {
  apply: (code, orderTotal) => api.post('/coupons/apply', null, { params: { code, orderTotal } }),
};

export const ContentService = {
  getBanners: () => api.get('/Content/banners'),
};

export const BrandService = {
  getAll: () => api.get('/Brands'),
};

export const OrderService = {
  create: (orderData) => api.post('/Orders', orderData),
  getAll: () => api.get('/Orders'),
  getById: (id) => api.get(`/Orders/${id}`),
};

export const VnPayService = {
  createPaymentUrl: (orderId, amount) => api.post(`/VnPay/create-payment?orderId=${orderId}&amount=${amount}`),
  verifyPayment: (queryString) => api.get(`/VnPay/return${queryString}`),
};

export default api;
