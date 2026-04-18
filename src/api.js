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

export default api;
