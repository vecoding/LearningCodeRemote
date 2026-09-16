<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { listArticles } from '@/api/articles'
import { useAuthStore } from '@/stores/auth'
import ArticleCard from '@/components/ArticleCard.vue'

const auth = useAuthStore()
const loading = ref(false)
const articles = ref([])
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await listArticles()
    articles.value = Array.isArray(data) ? data : []
  } catch {
    // 拦截器已统一处理弹窗；此处仅呈现空列表，UI 显示空状态卡片
    articles.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h1 class="page-title">文章列表</h1>
        <p class="page-subtitle">浏览社区中所有发布的文章，点击查看详情并点赞。</p>
      </div>
      <RouterLink v-if="auth.isLoggedIn" to="/articles/new">
        <el-button type="primary" :style="{ background: 'var(--brand-grad)', border: 'none' }">
          发布文章
        </el-button>
      </RouterLink>
    </div>

    <div v-loading="loading">
      <el-empty v-if="!loading && articles.length === 0" description="还没有任何文章">
        <RouterLink v-if="auth.isLoggedIn" to="/articles/new">
          <el-button type="primary">发布第一篇</el-button>
        </RouterLink>
        <RouterLink v-else to="/login">
          <el-button type="primary">登录后发布</el-button>
        </RouterLink>
      </el-empty>

      <div class="article-grid" v-else-if="articles.length">
        <ArticleCard v-for="a in articles" :key="a.ID" :article="a" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.page-title {
  margin: 0;
}
.page-subtitle {
  margin: 4px 0 0;
}
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}
</style>