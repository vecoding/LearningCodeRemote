import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { fileURLToPath, URL } from 'node:url'

// 后端地址（与 backend/config/config.yml 中 :3000 保持一致）
const BACKEND_TARGET = process.env.VITE_BACKEND_TARGET || 'http://127.0.0.1:3000'

// 前端 dev 服务地址必须与后端 CORS 配置 AllowOrigins: ["https://127.0.0.1:5173"] 完全匹配
// 因此使用 @vitejs/plugin-basic-ssl 自动签发自签名证书启用 HTTPS
export default defineConfig({
  plugins: [basicSsl(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  },
  // 把后端地址暴露给前端，业务代码可通过 import.meta.env.VITE_BACKEND_BASE 读取
  define: {
    'import.meta.env.VITE_BACKEND_BASE': JSON.stringify(BACKEND_TARGET)
  }
})