import { http } from './http';

/** 认证相关：POST /api/auth/login、POST /api/auth/register */
export const authApi = {
  login: (username, password) => http.post('/api/auth/login', { username, password }),
  register: (username, password) => http.post('/api/auth/register', { username, password }),
};

/** 汇率：GET /api/exchangeRates（公开）、POST /api/exchangeRates（需登录） */
export const rateApi = {
  list: () => http.get('/api/exchangeRates'),
  create: ({ fromCurrency, toCurrency, rate }) =>
    http.post(
      '/api/exchangeRates',
      { fromCurrency, toCurrency, rate: Number(rate) },
      { auth: true }
    ),
};

/** 文章：列表 / 详情 / 发布（均需登录） */
export const articleApi = {
  list: () => http.get('/api/articles', { auth: true }),
  detail: (id) => http.get(`/api/articles/${id}`, { auth: true }),
  create: ({ title, preview, content }) =>
    http.post('/api/articles', { title, preview, content }, { auth: true }),
};

/** 点赞：基于 Redis 计数 */
export const likeApi = {
  count: (id) => http.get(`/api/articles/${id}/like`, { auth: true }),
  like: (id) => http.post(`/api/articles/${id}/like`, undefined, { auth: true }),
};
