<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="nf-wrap">
    <div class="card nf-card">
      <div class="nf-code">404</div>
      <h1 class="nf-title">页面走丢了</h1>
      <p class="nf-desc">
        你访问的页面不存在或已被移除。<br />
        请检查地址是否正确，或返回首页继续浏览行情与资讯。
      </p>
      <div class="nf-actions">
        <button class="btn btn-primary" @click="router.push('/')">返回首页</button>
        <button class="btn btn-ghost" @click="router.back()">返回上一页</button>
      </div>
    </div>
  </div>
</template>
