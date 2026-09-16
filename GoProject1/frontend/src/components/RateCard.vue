<script setup>
import { formatDateTime } from '../utils/format';

defineProps({
  rate: { type: Object, required: true },
});
</script>

<template>
  <div class="rate-card">
    <div class="rate-pair">
      <span>{{ rate.fromCurrency }}</span>
      <span class="arrow">→</span>
      <span>{{ rate.toCurrency }}</span>
    </div>
    <div class="rate-value">{{ Number(rate.rate).toFixed(4) }}</div>
    <div class="rate-date">更新时间：{{ formatDateTime(rate.date) }}</div>
  </div>
</template>
