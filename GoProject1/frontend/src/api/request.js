import axios from 'axios'
import { ElMessage } from 'element-plus'

// 直接对接后端（与后端 CORS 配置一致：AllowOrigins: ["https://127.0.0.1:5173"]）
const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || 'http://127.0.0.1:3000'

const request = axios.create({
  baseURL: `${BACKEND_BASE}/api`,
  timeout: 15000
})

// 视为"业务正常、不需要弹窗"的错误模式：
// - HTTP 404
// - GORM 的 ErrRecordNotFound
// - MySQL "Table 'xxx' doesn't exist"（首次访问时表尚未被 AutoMigrate 建出来）
// 也可通过 config.silent === true 显式静默任何错误
const SILENT_PATTERNS = [
  /doesn't exist/i,
  /record not found/i,
  /ErrRecordNotFound/i
]

function shouldBeSilent(error) {
  const status = error.response?.status
  if (status === 404) return true
  if (error.config?.silent) return true
  const msg = error.response?.data?.error || error.message || ''
  return SILENT_PATTERNS.some((p) => p.test(msg))
}

// 点赞相关请求的最大同时弹窗数量
const LIKE_MESSAGE_MAX = 2
// 队列元素为 { handler, text }，text 用于去重
const likeMessageInstances = []

// 判断 URL 是否属于点赞接口（如 /articles/123/like）
function isLikeRequestUrl(url) {
  return /\/articles\/[^/]+\/like$/.test(url || '')
}

// 提取消息文本（支持字符串和 options 对象两种调用形式）
function extractMessageText(options) {
  if (typeof options === 'string') return options
  return options?.message ?? ''
}

/**
 * 推送一条"点赞相关"消息（成功 / 失败 / 频繁等）。
 * - 同时显示数量不超过 LIKE_MESSAGE_MAX（2），超出时关闭最早的实例。
 * - 队列中已存在相同文本的弹窗时不再重复弹出（去重）。
 * 供 ArticleDetailView 等调用，与拦截器中的点赞错误共用同一个队列。
 */
export function pushLikeMessage(options) {
  const text = extractMessageText(options)

  // 去重：队列里已有相同文本则不再弹出
  if (likeMessageInstances.some((item) => item.text === text)) {
    return { close: () => void 0 }
  }

  // 关闭最早的实例直到低于上限
  while (likeMessageInstances.length >= LIKE_MESSAGE_MAX) {
    const oldest = likeMessageInstances.shift()
    oldest?.handler?.close?.()
  }

  const userOnClose = typeof options === 'object' ? options.onClose : undefined
  const handler = ElMessage({
    ...(typeof options === 'object' ? options : { message: options }),
    onClose: () => {
      userOnClose?.()
      const idx = likeMessageInstances.findIndex((item) => item.handler === handler)
      if (idx !== -1) likeMessageInstances.splice(idx, 1)
    }
  })
  likeMessageInstances.push({ handler, text })
  return handler
}

// 请求拦截：自动附加 JWT
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截：统一错误处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const msg =
      error.response?.data?.error ||
      error.message ||
      '请求失败，请稍后再试'
    const reqUrl = error.config?.url || ''
    const isLoginRequest = reqUrl.endsWith('/auth/login')
    const isLikeRequest = isLikeRequestUrl(reqUrl)

    if (status === 401) {
      // 登录请求本身的 401 表示"账号或密码错误"，而不是 token 过期
      if (isLoginRequest) {
        ElMessage.error('账号或密码错误')
      } else if (isLikeRequest) {
        // 点赞请求的 401：进入点赞消息队列，避免破坏队列限制
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        pushLikeMessage({ message: '登录已过期，请重新登录', type: 'error' })
        if (window.location.hash !== '#/login') {
          window.location.href = '/#/login'
        }
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        ElMessage.error('登录已过期，请重新登录')
        if (window.location.hash !== '#/login') {
          window.location.href = '/#/login'
        }
      }
    } else if (isLikeRequest) {
      // 点赞请求的非 401 错误：进入点赞消息队列
      if (!shouldBeSilent(error)) {
        pushLikeMessage({ message: msg, type: 'error' })
      }
    } else if (!shouldBeSilent(error)) {
      // 非"未查到"类的错误才弹窗，避免给用户噪音
      ElMessage.error(msg)
    }
    // 即使静默，也要 reject 出去，让业务层能感知到（用于渲染空状态）
    return Promise.reject(error)
  }
)

export default request