<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { articleApi, likeApi } from '../api';
import { useAuth } from '../stores/auth';
import { showToast } from '../composables/useToast';
import { formatDateTime } from '../utils/format';

const props = defineProps({
  id: { type: String, required: true },
});

const emit = defineEmits(['open-auth']);
const router = useRouter();
const { isLoggedIn } = useAuth();

const article = ref(null);
const likes = ref('0');
const loading = ref(false);
const liking = ref(false);
const error = ref('');

async function load() {
  if (!isLoggedIn.value) {
    error.value = '文章内容需要登录后查看';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    article.value = await articleApi.detail(props.id);
    // 点赞数获取失败不影响正文展示
    const data = await likeApi.count(props.id).catch(() => ({ likes: '0' }));
    likes.value = data.likes ?? '0';
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function like() {
  liking.value = true;
  try {
    await likeApi.like(props.id);
    const data = await likeApi.count(props.id);
    likes.value = data.likes;
    showToast('点赞成功 ❤️', 'ok');
  } catch (e) {
    showToast(e.message, 'err');
  } finally {
    liking.value = false;
  }
}

onMounted(load);
</script>

<template>
  <section>
    <button class="btn btn-ghost" @click="router.push('/articles')">← 返回列表</button>

    <div v-if="loading" class="card detail-card">
      <p class="empty">加载中…</p>
    </div>

    <div v-else-if="error" class="card detail-card">
      <p class="empty">{{ error }}</p>
      <div v-if="!isLoggedIn" class="nf-actions">
        <button class="btn btn-primary" @click="emit('open-auth')">去登录</button>
      </div>
    </div>

    <article v-else-if="article" class="card detail-card">
      <h2>{{ article.Title }}</h2>
      <div class="detail-meta">
        <span>🕒 创建于 {{ formatDateTime(article.CreatedAt) }}</span>
        <span>🔄 更新于 {{ formatDateTime(article.UpdatedAt) }}</span>
      </div>
      <div class="detail-content">{{ article.Content }}</div>

      <div class="like-bar">
        <button class="btn btn-like" :disabled="liking" @click="like">👍 点赞</button>
        <span class="like-count">{{ likes }} 人觉得赞</span>
      </div>
    </article>
  </section>
</template>
