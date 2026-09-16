import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { public: true, title: '注册' }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页 · 汇率看板' }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/views/ArticlesView.vue'),
    meta: { title: '文章列表' }
  },
  {
    path: '/articles/new',
    name: 'CreateArticle',
    component: () => import('@/views/CreateArticleView.vue'),
    meta: { auth: true, title: '发布文章' }
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetailView.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/exchange-rates/new',
    name: 'CreateExchangeRate',
    component: () => import('@/views/CreateExchangeRateView.vue'),
    meta: { auth: true, title: '新增汇率' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.title) {
    document.title = `${to.meta.title} · CurrencyExchangeApp`
  }

  // 需要登录但未登录：跳转登录页
  if (to.meta.auth && !auth.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  // 已登录访问登录/注册页：直接去首页
  if (to.meta.public && auth.isLoggedIn && (to.name === 'Login' || to.name === 'Register')) {
    return { path: '/home' }
  }
})

export default router