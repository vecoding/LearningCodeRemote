import request from './request'

// 后端返回 { token: "Bearer xxxx" }，前端直接存到 localStorage
export const login = (payload) => request.post('/auth/login', payload)

export const register = (payload) => request.post('/auth/register', payload)