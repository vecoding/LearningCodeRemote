<script setup>
import { onMounted, reactive, ref } from 'vue';
import RateCard from '../components/RateCard.vue';
import { rateApi } from '../api';
import { useAuth } from '../stores/auth';
import { showToast } from '../composables/useToast';

const emit = defineEmits(['open-auth']);
const { isLoggedIn } = useAuth();

const rates = ref([]);
const loading = ref(false);
const error = ref('');
const formVisible = ref(false);
const submitting = ref(false);
const form = reactive({ fromCurrency: '', toCurrency: '', rate: '' });

async function loadRates() {
  loading.value = true;
  error.value = '';
  try {
    const data = await rateApi.list();
    rates.value = data.exchangeRates || [];
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
  form.fromCurrency = '';
  form.toCurrency = '';
  form.rate = '';
}

async function submit() {
  const fromCurrency = form.fromCurrency.trim().toUpperCase();
  const toCurrency = form.toCurrency.trim().toUpperCase();
  if (!fromCurrency || !toCurrency || form.rate === '') {
    showToast('请填写完整的汇率信息', 'err');
    return;
  }
  submitting.value = true;
  try {
    await rateApi.create({ fromCurrency, toCurrency, rate: form.rate });
    showToast('汇率录入成功', 'ok');
    formVisible.value = false;
    resetForm();
    await loadRates();
  } catch (e) {
    showToast(e.message, 'err');
  } finally {
    submitting.value = false;
  }
}

onMounted(loadRates);
</script>

<template>
  <section>
    <div class="view-header">
      <h2>💱 汇率行情</h2>
      <button class="btn btn-primary" @click="openForm">+ 录入汇率</button>
    </div>

    <div v-if="formVisible" class="card form-card">
      <h3>录入新汇率</h3>
      <div class="form-grid">
        <div class="form-item">
          <label>源货币</label>
          <input v-model="form.fromCurrency" placeholder="如 USD" />
        </div>
        <div class="form-item">
          <label>目标货币</label>
          <input v-model="form.toCurrency" placeholder="如 CNY" />
        </div>
        <div class="form-item">
          <label>汇率</label>
          <input v-model="form.rate" type="number" step="0.0001" placeholder="如 7.25" />
        </div>
        <div class="form-item form-action">
          <button class="btn btn-primary" :disabled="submitting" @click="submit">提交</button>
          <button class="btn btn-ghost" @click="formVisible = false">取消</button>
        </div>
      </div>
    </div>

    <div class="rate-grid">
      <p v-if="loading" class="empty">加载中…</p>
      <p v-else-if="error" class="empty">加载失败：{{ error }}</p>
      <p v-else-if="!rates.length" class="empty">暂无汇率数据</p>
      <RateCard v-for="item in rates" :key="item._id" :rate="item" />
    </div>
  </section>
</template>
