import { reactive } from 'vue';

export const toasts = reactive([]);
let seq = 0;

/**
 * 全局轻提示
 * @param {string} message 文本
 * @param {'ok'|'err'} type 类型
 */
export function showToast(message, type = 'ok') {
  const id = ++seq;
  toasts.push({ id, message, type });
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) toasts.splice(index, 1);
  }, 2600);
}
