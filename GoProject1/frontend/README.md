# CurrencyExchangeApp · 前端

基于 **Vue 3 + Vite + Pinia + Vue Router + Element Plus + Axios** 的前端单页应用，与同目录下的 `backend`（Gin + GORM + Redis）配套使用。

> 后端代码未做任何改动。后端已在 `router/router.go` 中通过 `gin-contrib/cors` 放行 `https://127.0.0.1:5173`，
> 因此前端 dev 服务必须以 **HTTPS** 启动并直接以 `http://127.0.0.1:3000` 作为后端地址，
> 通过 `@vitejs/plugin-basic-ssl` 自动签发自签名证书即可让浏览器地址与 CORS 配置完全匹配。

## 功能一览

| 模块 | 路由 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| 登录 | `#/login` | 公开 | 用户名 + 密码登录，返回 JWT 自动保存 |
| 注册 | `#/register` | 公开 | 注册成功自动登录 |
| 首页 / 汇率看板 | `#/home` | 公开 | 展示所有汇率（`GET /api/exchangeRates`） |
| 文章列表 | `#/articles` | 需要登录 | `GET /api/articles` |
| 文章详情 | `#/articles/:id` | 需要登录 | 支持点赞（`POST/GET /api/articles/:id/like`） |
| 发布文章 | `#/articles/new` | 需要登录 | `POST /api/articles` |
| 新增汇率 | `#/exchange-rates/new` | 需要登录 | `POST /api/exchangeRates` |

## 目录结构

```
frontend/
├── index.html
├── package.json
├── vite.config.js          # 启用 HTTPS（plugin-basic-ssl），使 origin = https://127.0.0.1:5173
├── public/
│   └── favicon.svg
└── src/
    ├── main.js             # 入口、注册 Element Plus / Pinia / Router
    ├── App.vue
    ├── assets/styles.css   # 全局样式
    ├── api/                # Axios 封装 + 各业务模块接口
    │   ├── request.js      # 请求/响应拦截器（自动附 Token、401 处理）
    │   ├── auth.js
    │   ├── articles.js
    │   └── exchangeRates.js
    ├── stores/auth.js      # Pinia 鉴权 store
    ├── router/index.js     # 路由 + 鉴权守卫
    ├── utils/format.js     # 日期格式化
    ├── components/
    │   ├── NavBar.vue
    │   └── ArticleCard.vue
    └── views/
        ├── HomeView.vue
        ├── LoginView.vue
        ├── RegisterView.vue
        ├── ArticlesView.vue
        ├── ArticleDetailView.vue
        ├── CreateArticleView.vue
        ├── CreateExchangeRateView.vue
        └── NotFoundView.vue
```

## 本地开发

### 1. 启动后端

确保 MySQL、Redis 已就绪，然后：

```bash
cd ../backend
go run main.go
# 默认监听 :3000（见 backend/config/config.yml）
```

### 2. 安装前端依赖并启动

```bash
cd frontend
npm install
npm run dev
```

打开浏览器访问 <https://127.0.0.1:5173>。

> 因为使用自签名证书，浏览器会提示"您的连接不是私密连接"，点击 **高级 → 继续前往 127.0.0.1（不安全）** 即可（仅本地开发）。
> 如需修改后端地址，设置环境变量 `VITE_BACKEND_TARGET=http://your-host:port` 后再启动。

### 3. 生产构建

```bash
npm run build
npm run preview
```

构建产物在 `frontend/dist/`，可直接由任意静态服务器托管。

## 关键设计要点

1. **JWT 鉴权**：`utils.GenerateJWT` 生成的 token 已带 `Bearer ` 前缀；前端在 `src/api/request.js` 中直接写入 `Authorization` 头，后端中间件 `auth_middleware.go` 同样兼容这种格式。
2. **CORS 兼容**：dev 服务以 `https://127.0.0.1:5173` 启动（与后端 `AllowOrigins` 完全一致），浏览器直接对 `http://127.0.0.1:3000/api/...` 发起跨域请求，由 `router/router.go` 中的 `cors.New(...)` 中间件放行。生产环境部署时同样需要保证 origin 在后端 CORS 白名单内。
3. **路由守卫**：在 `router/index.js` 中通过 `meta.auth / meta.public` 控制访问权限；未登录访问受保护页面会被重定向到 `/login`，并带上 `redirect` 参数，登录后自动回到原页面。
4. **错误统一处理**：Axios 拦截器对 `status === 401` 自动清空登录信息并跳转；其它错误通过 `ElMessage` 统一提示。
5. **缓存提示**：后端 `articles` 列表带 Redis 缓存（10 分钟），新建文章后会被 `Del(cacheKey)` 清掉，前端无需特殊处理。

## 常见问题

- **登录后跳转空白**：检查后端是否正常监听；浏览器控制台会显示具体错误。
- **跨域被拒（No 'Access-Control-Allow-Origin' header）**：确认浏览器地址栏是 `https://127.0.0.1:5173` 而不是 `http://` —— 后端 CORS 仅放行了 HTTPS origin。
- **点赞数一直为 0**：Redis 初次访问会返回 `redis.Nil`，后端已处理；前端展示使用 `Number(data?.likes || 0)`。