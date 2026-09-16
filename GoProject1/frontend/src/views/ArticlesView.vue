<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ArticleCard from '../components/ArticleCard.vue';
import { articleApi } from '../api';
import { useAuth } from '../stores/auth';
import { showToast } from '../composables/useToast';

const emit = defineEmits(['open-auth']);
const { isLoggedIn } = useAuth();

const articles = ref([]);
const loading = ref(false);
const error = ref('');
const formVisible = ref(false);
const submitting = ref(false);
const form = reactive({ title: '', preview: '', content: '' });

async function loadArticles() {
  if (!isLoggedIn.value) {
    articles.value = [];
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const data = await articleApi.list();
    articles.value = Array.isArray(data) ? data : [];
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function openForm() {
  if (!isLoggedIn.value) {
    emit('open-auth');
    return;
  }
  formVisible.value = !formVisible.value;
}

function resetForm() {
  form.title = '';
  form.preview = '';
  form.content = '';
}

async function submit() {
  if (!form.title.trim() || !form.preview.trim() || !form.content.trim()) {
    showToast('标题、摘要和正文均为必填项', 'err');
    return;
  }
  submitting.value = true;
  try {
    await articleApi.create({
      title: form.title.trim(),
      preview: form.preview.trim(),
      content: form.content.trim(),
    });
    showToast('文章发布成功 🎉', 'ok');
    formVisible.value = false;
    resetForm();
    await loadArticles();
  } catch (e) {
    showToast(e.message, 'err');
  } finally {
    submitting.value = false;
  }
}

onMounted(loadArticles);

// 登录后自动拉取列表
watch(isLoggedIn, (logged) => {
  if (logged) loadArticles();
  else articles.value = [];
});
</script>

<template>
  <section>
    <div class="view-header">
      <h2>📰 文章资讯</h2>
      <button class="btn btn-primary" @click="openForm">+ 发布文章</button>
    </div>

    <div v-if="!isLoggedIn" class="card tip-card">
      文章内容需要登录后查看，请先
      <a href="#" @click.prevent="emit('open-auth')">登录 / 注册</a>。
    </div>

    <template v-else>
      <div v-if="formVisible" class="card form-card">
        <h3>发布新文章</h3>
        <div class="form-item">
          <label>标题</label>
          <input v-model="form.title" placeholder="请输入文章标题" />
        </div>
        <div class="form-item">
          <label>摘要（Preview）</label>
          <input v-model="form.preview" placeholder="一句话摘要" />
        </div>
        <div class="form-item">
          <label>正文</label>
          <textarea v-model="form.content" rows="6" placeholder="请输入正文内容"></textarea>
        </div>
        <div class="form-action-row">
          <button class="btn btn-primary" :disabled="submitting" @click="submit">发布</button>
          <button class="btn btn-ghost" @click="formVisible = false">取消</button>
        </div>
      </div>

      <div class="article-list">
        <p v-if="loading" class="empty">加载中…</p>
        <p v-else-if="error" class="empty">加载失败：{{ error }}</p>
        <p v-else-if="!articles.length" class="empty">暂无文章，快发布第一篇吧 ✍️</p>
        <ArticleCard v-for="item in articles" :key="item.ID" :article="item" />
      </div>
    </template>
  </section>
</template>
