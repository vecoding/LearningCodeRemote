import request from './request'

// 列表（鉴权）
export const listArticles = () => request.get('/articles')

// 详情（鉴权）
export const getArticle = (id) => request.get(`/articles/${id}`)

// 创建（鉴权）
export const createArticle = (payload) => request.post('/articles', payload)

// 获取点赞数（鉴权）
export const getArticleLikes = (id) => request.get(`/articles/${id}/like`)

// 点赞（鉴权）
export const likeArticle = (id) => request.post(`/articles/${id}/like`)