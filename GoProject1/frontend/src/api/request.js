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

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      ElMessage.error('登录已过期，请重新登录')
      if (window.location.hash !== '#/login') {
        window.location.href = '/#/login'
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