import request from './request'

// 获取汇率列表（公开）
export const listExchangeRates = () => request.get('/exchangeRates')

// 创建汇率（鉴权）
export const createExchangeRate = (payload) => request.post('/exchangeRates', payload)