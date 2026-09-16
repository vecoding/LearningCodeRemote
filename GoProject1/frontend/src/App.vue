<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import AuthModal from './components/AuthModal.vue';
import ToastHost from './components/ToastHost.vue';

const authVisible = ref(false);
</script>

<template>
  <NavBar @open-auth="authVisible = true" />

  <main class="container">
    <RouterView v-slot="{ Component }">
      <component :is="Component" @open-auth="authVisible = true" />
    </RouterView>
  </main>

  <footer class="footer">CurrencyExchangeApp · Vue 3 前端 / Go + Gin 后端</footer>

  <AuthModal v-model="authVisible" />
  <ToastHost />
</template>
