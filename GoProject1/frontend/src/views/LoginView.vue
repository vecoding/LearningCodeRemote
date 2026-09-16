<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 32, message: '用户名长度 3-32', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 64, message: '密码长度 6-64', trigger: 'blur' }
  ]
}

async function submit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  loading.value = true
  try {
    await auth.login({ username: form.username, password: form.password })
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/home'
    router.push(redirect)
  } catch (e) {
    /* 拦截器已统一提示 */
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1>欢迎回来</h1>
        <p>登录以查看文章、发布内容和提交汇率</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="submit-btn" @click="submit">
          登 录
        </el-button>
      </el-form>

      <div class="auth-footer">
        还没有账号？
        <RouterLink to="/register">立即注册</RouterLink>
      </div>
    </div>

    <div class="auth-side">
      <div class="auth-side-inner">
        <h2>CurrencyExchange</h2>
        <p>实时汇率 · 社区文章 · 简洁高效</p>
        <ul>
          <li>📈 浏览最新汇率数据</li>
          <li>📝 阅读与发布精彩文章</li>
          <li>❤️ 为喜爱的内容点赞</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  min-height: calc(100vh - 140px);
  align-items: center;
}
.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 8px 32px rgba(17, 24, 39, 0.08);
  border: 1px solid #f0f2f5;
}
.auth-header h1 {
  font-size: 26px;
  margin: 0 0 6px;
}
.auth-header p {
  color: #6b7280;
  margin: 0 0 28px;
}
.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  background: var(--brand-grad);
  border: none;
  margin-top: 4px;
}
.submit-btn:hover {
  opacity: 0.92;
}
.auth-footer {
  text-align: center;
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
}
.auth-footer a {
  color: #4f46e5;
  font-weight: 600;
  margin-left: 4px;
}
.auth-side {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: var(--brand-grad);
  color: #fff;
  min-height: 460px;
  padding: 40px;
}
.auth-side-inner h2 {
  font-size: 28px;
  margin: 0 0 8px;
}
.auth-side-inner p {
  margin: 0 0 24px;
  opacity: 0.92;
}
.auth-side-inner ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 15px;
  line-height: 2;
}
@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
  .auth-side {
    display: none;
  }
}
</style>