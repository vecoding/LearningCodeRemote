<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '../stores/auth';
import { showToast } from '../composables/useToast';

const visible = defineModel({ type: Boolean, default: false });

const { login, register } = useAuth();

const mode = ref('login');
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

watch(visible, (val) => {
  if (val) {
    username.value = '';
    password.value = '';
    error.value = '';
  }
});

function switchMode(next) {
  mode.value = next;
  error.value = '';
}

async function submit() {
  if (!username.value.trim() || !password.value) {
    error.value = '请输入用户名和密码';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const fn = mode.value === 'login' ? login : register;
    await fn(username.value.trim(), password.value);
    const text = mode.value === 'login' ? '登录成功' : '注册成功，已自动登录';
    visible.value = false;
    showToast(text, 'ok');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-mask" @click="visible = false"></div>
    <div class="modal-body card">
      <h3>{{ mode === 'login' ? '登录' : '注册' }}</h3>

      <div class="tab-switch">
        <button class="tab" :class="{ active: mode === 'login' }" @click="switchMode('login')">
          登录
        </button>
        <button class="tab" :class="{ active: mode === 'register' }" @click="switchMode('register')">
          注册
        </button>
      </div>

      <div class="form-item">
        <label>用户名</label>
        <input v-model="username" placeholder="请输入用户名" autocomplete="username" />
      </div>
      <div class="form-item">
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          autocomplete="current-password"
          @keyup.enter="submit"
        />
      </div>

      <div class="form-action-row">
        <button class="btn btn-primary btn-block" :disabled="loading" @click="submit">
          {{ loading ? '提交中…' : mode === 'login' ? '登录' : '注册并登录' }}
        </button>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>
