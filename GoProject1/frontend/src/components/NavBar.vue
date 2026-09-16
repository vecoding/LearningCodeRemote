<script setup>
import { RouterLink } from 'vue-router';
import { useAuth } from '../stores/auth';
import { showToast } from '../composables/useToast';

const emit = defineEmits(['open-auth']);
const { state, isLoggedIn, logout } = useAuth();

function handleLogout() {
  logout();
  showToast('已退出登录', 'ok');
}
</script>

<template>
  <header class="navbar">
    <div class="nav-inner">
      <RouterLink to="/" class="logo">💱 汇率与资讯平台</RouterLink>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" exact-active-class="active">汇率行情</RouterLink>
        <RouterLink to="/articles" class="nav-link" active-class="active">文章资讯</RouterLink>
      </nav>

      <div class="nav-user">
        <span v-if="isLoggedIn" class="welcome">👋 {{ state.username }}</span>
        <button v-if="isLoggedIn" class="btn btn-ghost" @click="handleLogout">退出登录</button>
        <button v-else class="btn btn-primary" @click="emit('open-auth')">登录 / 注册</button>
      </div>
    </div>
  </header>
</template>
