<script setup>
import { RouterLink } from 'vue-router'
import { formatDateShort } from '@/utils/format'

defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <RouterLink :to="`/articles/${article.ID}`" class="article-card">
    <div class="preview">
      <span>{{ article.preview || (article.content || '').slice(0, 80) }}</span>
    </div>
    <div class="meta">
      <h3 class="title">{{ article.title }}</h3>
      <div class="footer">
        <span class="date">{{ formatDateShort(article.CreatedAt) }}</span>
        <span class="id">#{{ article.ID }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #f0f2f5;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  color: inherit;
}
.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.08);
  border-color: #d6deff;
}
.preview {
  height: 120px;
  background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%);
  padding: 16px;
  font-size: 14px;
  color: #4b5563;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}
.preview::before {
  content: '';
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.08);
}
.meta {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 12px;
  color: #909399;
}
.id {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.08);
  padding: 2px 8px;
  border-radius: 999px;
}
</style>