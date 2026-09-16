<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const isLoggedIn = computed(() => auth.isLoggedIn)
const username = computed(() => auth.username)

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning'
    })
    auth.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    /* 用户取消 */
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <div class="brand">
        <RouterLink to="/home" class="brand-link">
          <span class="brand-mark">¥</span>
          <span class="brand-text">CurrencyExchange</span>
        </RouterLink>
      </div>

      <nav class="nav-links">
        <RouterLink to="/home" :class="{ active: route.path === '/home' }">首页</RouterLink>
        <RouterLink to="/articles" :class="{ active: route.path.startsWith('/articles') && route.name !== 'CreateArticle' }">文章</RouterLink>
      </nav>

      <div class="nav-actions">
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click">
            <span class="user-chip">
              <el-icon><UserFilled /></el-icon>
              <span>{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>已登录</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <el-button type="primary" plain size="small">登录</el-button>
          </RouterLink>
          <RouterLink to="/register">
            <el-button type="primary" size="small">注册</el-button>
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid #ebeef5;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  gap: 24px;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 18px;
  color: #1f2937;
}
.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--brand-grad);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}
.nav-links {
  display: flex;
  gap: 4px;
  margin-left: 8px;
  flex: 1;
}
.nav-links a {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  transition: all 0.18s ease;
}
.nav-links a:hover {
  background: #f3f4f6;
  color: #111827;
}
.nav-links a.active {
  background: rgba(79, 70, 229, 0.08);
  color: #4f46e5;
  font-weight: 600;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #f3f4f6;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;
}
.user-chip:hover {
  background: #e5e7eb;
}
@media (max-width: 768px) {
  .navbar-inner {
    height: 56px;
    gap: 12px;
    padding: 0 12px;
  }
  .brand-text {
    display: none;
  }
  .nav-links a {
    padding: 6px 8px;
    font-size: 13px;
  }
}
</style>