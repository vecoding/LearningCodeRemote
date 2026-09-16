<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { listExchangeRates } from '@/api/exchangeRates'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const router = useRouter()

const loading = ref(false)
const rates = ref([])
const error = ref('')

async function loadRates() {
  loading.value = true
  error.value = ''
  try {
    const data = await listExchangeRates()
    rates.value = Array.isArray(data?.exchangeRates) ? data.exchangeRates : []
  } catch {
    // 拦截器已统一处理弹窗；这里只需呈现空数据，UI 自然显示"暂无数据"
    rates.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadRates)

const hasRates = computed(() => rates.value.length > 0)
</script>

<template>
  <section>
    <div class="hero">
      <div class="hero-text">
        <h1>汇率看板</h1>
        <p>实时查看货币之间的最新汇率，并管理你的文章内容。</p>
        <div class="hero-actions">
          <RouterLink to="/articles">
            <el-button size="large" :style="{ background: 'var(--brand-grad)', border: 'none' }">
              浏览文章
            </el-button>
          </RouterLink>
          <el-button v-if="auth.isLoggedIn" size="large" @click="router.push('/exchange-rates/new')">
            新增汇率
          </el-button>
          <RouterLink v-else to="/login">
            <el-button size="large">登录以提交汇率</el-button>
          </RouterLink>
        </div>
      </div>
      <div class="hero-card">
        <div class="hero-card-title">今日亮点</div>
        <div class="hero-card-value">{{ hasRates ? rates[0].fromCurrency + ' → ' + rates[0].toCurrency : '暂无数据' }}</div>
        <div class="hero-card-rate" v-if="hasRates">
          1 {{ rates[0].fromCurrency }} = <strong>{{ Number(rates[0].rate).toFixed(4) }}</strong> {{ rates[0].toCurrency }}
        </div>
        <div class="hero-card-rate" v-else>提交或导入第一条汇率即可在此展示</div>
      </div>
    </div>

    <div class="section-card">
      <div class="card-header">
        <h2 class="page-title">所有汇率</h2>
        <el-button text @click="loadRates" :loading="loading">刷新</el-button>
      </div>

      <el-empty v-if="!loading && !hasRates" description="暂无汇率数据" />

      <el-table
        v-else
        :data="rates"
        v-loading="loading"
        stripe
        style="width: 100%"
        :empty-text="error || '暂无数据'"
      >
        <el-table-column prop="fromCurrency" label="源币种" width="160" />
        <el-table-column label="" width="60" align="center">
          <template #default><el-icon><Right /></el-icon></template>
        </el-table-column>
        <el-table-column prop="toCurrency" label="目标币种" width="160" />
        <el-table-column prop="rate" label="汇率" width="180">
          <template #default="{ row }">
            <span class="rate-value">{{ Number(row.rate).toFixed(4) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="更新时间">
          <template #default="{ row }">{{ formatDate(row.date) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.hero-text {
  background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%);
  border-radius: 16px;
  padding: 36px 32px;
}
.hero-text h1 {
  margin: 0 0 8px;
  font-size: 30px;
}
.hero-text p {
  color: #4b5563;
  margin: 0 0 24px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.hero-card {
  background: var(--brand-grad);
  color: #fff;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-card-title {
  font-size: 13px;
  opacity: 0.86;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.hero-card-value {
  font-size: 26px;
  font-weight: 700;
  margin: 8px 0 14px;
}
.hero-card-rate {
  font-size: 16px;
  opacity: 0.95;
}
.hero-card-rate strong {
  font-size: 22px;
  margin: 0 4px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.rate-value {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #4f46e5;
}
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero-text h1 {
    font-size: 24px;
  }
}
</style>