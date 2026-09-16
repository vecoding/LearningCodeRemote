<script setup>
import { formatDateTime } from '../utils/format';

defineProps({
  article: { type: Object, required: true },
});
</script>

<template>
  <RouterLink class="article-card" :to="`/articles/${article.ID}`">
    <h3>{{ article.Title }}</h3>
    <div class="article-preview">{{ article.Preview }}</div>
    <div class="article-meta">
      <span>🕒 {{ formatDateTime(article.CreatedAt) }}</span>
      <span>👍 {{ article.Likes }}</span>
    </div>
  </RouterLink>
</template>
