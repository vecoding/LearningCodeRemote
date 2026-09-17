<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { getArticle, likeArticle, getArticleLikes } from '@/api/articles'
import { pushLikeMessage } from '@/api/request'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const article = ref(null)
const likes = ref(0)
const liked = ref(false)
const loading = ref(false)
const liking = ref(false)

// 点赞 / 取消点赞之间的最短间隔，避免短时间内反复切换
const LIKE_COOLDOWN_MS = 1000
const lastLikeTime = ref(0)

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
    liked.value = Boolean(data?.isLike)
  } catch {
    likes.value = 0
    liked.value = false
  }
}

async function handleLike() {
  if (!auth.isLoggedIn) {
    pushLikeMessage({ message: '请先登录', type: 'warning' })
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  // 冷却期检查：点赞与取消点赞之间不允许立刻反向操作
  const now = Date.now()
  if (now - lastLikeTime.value < LIKE_COOLDOWN_MS) {
    pushLikeMessage({ message: '操作太频繁，请稍后再试', type: 'warning' })
    return
  }
  if (liking.value) return
  const id = route.params.id
  liking.value = true
  try {
    // 后端为 toggle 行为：未点赞 → 点赞；已点赞 → 取消
    const data = await likeArticle(id)
    const message = data?.message || ''
    if (message.includes('unliked')) {
      liked.value = false
      likes.value = Math.max(0, (likes.value || 0) - 1)
      pushLikeMessage({ message: '已取消点赞', type: 'success' })
    } else {
      liked.value = true
      likes.value = (likes.value || 0) + 1
      pushLikeMessage({ message: '点赞成功', type: 'success' })
    }
  } catch {
    /* 点赞失败的错误已在拦截器中通过 pushLikeMessage 显示 */
  } finally {
    liking.value = false
    lastLikeTime.value = Date.now()
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
          :type="liked ? 'warning' : 'primary'"
          size="large"
          :loading="liking"
          :disabled="liking"
          round
          @click="handleLike"
          :class="['like-btn', { 'is-liked': liked }]"
        >
          <el-icon class="like-btn-icon">
            <component :is="liked ? StarFilled : Star" />
          </el-icon>
          <span>{{ liked ? '已点赞' : '点赞' }}</span>
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
.like-btn {
  background: var(--brand-grad);
  border: none;
  min-width: 140px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.like-btn:hover:not(.is-disabled):not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.28);
}
.like-btn.is-liked {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
}
.like-btn.is-liked:hover:not(.is-disabled):not(:disabled) {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
}
.like-btn-icon {
  margin-right: 4px;
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