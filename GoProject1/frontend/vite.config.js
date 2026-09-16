import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 前后端分离：前端独立运行，通过 dev server 将 /api 反向代理到 Go 后端，
// 浏览器视角保持同源，无需后端添加任何 CORS 中间件。
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 显式绑定 IPv4 回环：默认值 'localhost' 在本机解析到 ::1（IPv6），
    // 会导致 http://127.0.0.1:5173 无法访问
    host: '127.0.0.1',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        // 后端未启动时给出明确提示，而不是裸的 500
        configure(proxy) {
          proxy.on('error', (err, req, res) => {
            if (res.headersSent || res.writableEnded) return;
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: '无法连接后端服务，请先运行 go run main.go' }));
          });
        },
      },
    },
  },
});
