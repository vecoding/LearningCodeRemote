import { computed, reactive } from 'vue';
import { authApi } from '../api';
import { clearAuth, getToken, getUsername, setAuth } from '../api/token';
import { setUnauthorizedHandler } from '../api/http';
import { showToast } from '../composables/useToast';

const state = reactive({
  token: getToken(),
  username: getUsername(),
});

const isLoggedIn = computed(() => !!state.token);

async function login(username, password) {
  const { token } = await authApi.login(username, password);
  applyAuth(token, username);
  return token;
}

async function register(username, password) {
  const { token } = await authApi.register(username, password);
  applyAuth(token, username);
  return token;
}

function applyAuth(token, username) {
  setAuth(token, username);
  state.token = token;
  state.username = username;
}

function logout(silent = false) {
  clearAuth();
  state.token = '';
  state.username = '';
  if (!silent) showToast('已退出登录', 'ok');
}

// 任意请求返回 401 时统一清理登录态
setUnauthorizedHandler(() => {
  logout(true);
  showToast('登录已失效，请重新登录', 'err');
});

export function useAuth() {
  return { state, isLoggedIn, login, register, logout };
}
