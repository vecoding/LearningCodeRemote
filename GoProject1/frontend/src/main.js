import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './stores/auth'; // 初始化登录态（注册 401 处理）
import './styles/main.css';

createApp(App).use(router).mount('#app');
