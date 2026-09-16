import { getToken } from './token';

// 开发环境走 vite 代理（同源），生产环境可用 VITE_API_BASE 指向后端地址
const BASE = import.meta.env.VITE_API_BASE || '';

let unauthorizedHandler = null;

/** 注册登录失效回调，由 auth store 注入，避免与 store 形成循环依赖 */
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

function buildUrl(path) {
  if (!BASE) return path;
  const base = BASE.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return base + suffix;
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  // 后端 AuthMiddleware 直接读取 Authorization 头的原始 JWT，不需要 Bearer 前缀
  if (auth) headers.Authorization = getToken();

  let res;
  try {
    res = await fetch(buildUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('网络异常，请确认后端服务已启动');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && getToken()) unauthorizedHandler?.();
    throw new Error(data.error || `请求失败 (${res.status})`);
  }
  return data;
}

export const http = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { method: 'POST', body, ...options }),
};
