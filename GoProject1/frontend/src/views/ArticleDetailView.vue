<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticle, likeArticle, getArticleLikes } from '@/api/articles'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const article = ref(null)
const likes = ref(0)
const loading = ref(false)
const liking = ref(false)

async function load() {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const data = await getArticle(id)
    article.value = data
    await refreshLikes()
  } catch (e) {
    article.value = null
  } finally {
    loading.value = false
  }
}

async function refreshLikes() {
  const id = route.params.id
  if (!id) return
  try {
    const data = await getArticleLikes(id)
    likes.value = Number(data?.likes || 0)
  } catch {
    likes.value = 0
  }
}

async function handleLike() {
  if (!auth.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  const id = route.params.id
  liking.value = true
  try {
    await likeArticle(id)
    await refreshLikes()
    ElMessage.success('点赞成功')
  } catch {
    /* 拦截器已处理 */
  } finally {
    liking.value = false
  }
}

onMounted(load)
watch(() => route.params.id, load)
</script>

<template>
  <section v-loading="loading">
    <div v-if="article" class="article-detail">
      <div class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="meta">
          <el-tag size="small" type="info">#{{ article.ID }}</el-tag>
          <span class="time">{{ formatDate(article.CreatedAt) }}</span>
        </div>
      </div>

      <div class="preview-banner">
        <el-icon><Document /></el-icon>
        <span>{{ article.preview }}</span>
      </div>

      <article class="content">
        <p v-for="(line, idx) in (article.content || '').split('\n')" :key="idx">
          {{ line || '\u00a0' }}
        </p>
      </article>

      <div class="like-bar">
        <el-button
          type="primary"
          size="large"
          :loading="liking"
          @click="handleLike"
          :style="{ background: 'var(--brand-grad)', border: 'none' }"
        >
          <el-icon><Star /></el-icon>
          <span>点赞</span>
        </el-button>
        <div class="like-count">
          <el-icon><StarFilled /></el-icon>
          <span>{{ likes }}</span>
          <span class="text">人点赞</span>
        </div>
      </div>

      <div class="back-row">
        <el-button text @click="router.push('/articles')">
          <el-icon><ArrowLeft /></el-icon>
          返回文章列表
        </el-button>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="文章不存在或已被删除">
      <RouterLink to="/articles">
        <el-button type="primary">返回列表</el-button>
      </RouterLink>
    </el-empty>
  </section>
</template>

<style scoped>
.article-detail {
  background: #fff;
  border-radius: 16px;
  padding: 36px 40px;
  box-shadow: 0 8px 32px rgba(17, 24, 39, 0.06);
  border: 1px solid #f0f2f5;
  max-width: 880px;
  margin: 0 auto;
}
.article-header h1 {
  font-size: 28px;
  margin: 0 0 12px;
  color: #111827;
}
.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 13px;
  margin-bottom: 24px;
}
.preview-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%);
  color: #4f46e5;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
  border-left: 3px solid #4f46e5;
}
.content {
  font-size: 16px;
  line-height: 1.85;
  color: #1f2937;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 28px;
}
.like-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-top: 1px dashed #ebeef5;
  border-bottom: 1px dashed #ebeef5;
}
.like-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #f59e0b;
  font-weight: 600;
}
.like-count .text {
  color: #909399;
  font-weight: 400;
  margin-left: 2px;
}
.back-row {
  margin-top: 16px;
}
@media (max-width: 768px) {
  .article-detail {
    padding: 24px 20px;
  }
  .article-header h1 {
    font-size: 22px;
  }
}
</style>