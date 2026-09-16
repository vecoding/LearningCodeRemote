<script setup>
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="card">
      <div class="big">404</div>
      <h2>页面走丢了 🧭</h2>
      <p>您访问的页面不存在或已被移除。</p>
      <el-button type="primary" @click="router.push('/home')" :style="{ background: 'var(--brand-grad)', border: 'none' }">
        返回首页
      </el-button>
      <div class="alt">
        或者 <RouterLink to="/articles">浏览文章</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
.card {
  text-align: center;
  background: #fff;
  border-radius: 16px;
  padding: 48px 56px;
  box-shadow: 0 8px 32px rgba(17, 24, 39, 0.06);
  border: 1px solid #f0f2f5;
}
.big {
  font-size: 88px;
  font-weight: 900;
  background: var(--brand-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}
h2 {
  margin: 12px 0 4px;
}
p {
  color: #6b7280;
  margin: 0 0 24px;
}
.alt {
  margin-top: 12px;
  font-size: 14px;
  color: #6b7280;
}
.alt a {
  color: #4f46e5;
  font-weight: 600;
}
</style>