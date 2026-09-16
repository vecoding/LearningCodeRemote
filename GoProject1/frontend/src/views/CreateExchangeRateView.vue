<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createExchangeRate } from '@/api/exchangeRates'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  fromCurrency: '',
  toCurrency: '',
  rate: ''
})

const rules = {
  fromCurrency: [
    { required: true, message: '请输入源币种', trigger: 'blur' },
    { pattern: /^[A-Za-z]{2,8}$/, message: '请输入 2-8 位字母的币种代码，如 USD、CNY', trigger: 'blur' }
  ],
  toCurrency: [
    { required: true, message: '请输入目标币种', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value && value.toUpperCase() === form.fromCurrency.toUpperCase()) {
          callback(new Error('目标币种不能与源币种相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    { pattern: /^[A-Za-z]{2,8}$/, message: '请输入 2-8 位字母的币种代码', trigger: 'blur' }
  ],
  rate: [
    { required: true, message: '请输入汇率', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        const n = Number(value)
        if (Number.isNaN(n) || n <= 0) {
          callback(new Error('汇率必须是大于 0 的数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

async function submit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    await createExchangeRate({
      fromCurrency: form.fromCurrency.toUpperCase(),
      toCurrency: form.toCurrency.toUpperCase(),
      rate: Number(form.rate)
    })
    ElMessage.success('汇率已提交')
    router.push('/home')
  } catch {
    /* 拦截器已处理 */
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="page-title">新增汇率</h1>
    <p class="page-subtitle">填写源币种、目标币种与汇率，提交即可被所有人查看。</p>

    <div class="section-card form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="submit"
      >
        <div class="grid">
          <el-form-item label="源币种 (From)" prop="fromCurrency">
            <el-input
              v-model="form.fromCurrency"
              placeholder="如 USD"
              maxlength="8"
              style="text-transform: uppercase"
            />
          </el-form-item>
          <div class="arrow">
            <el-icon size="28" color="#4f46e5"><Right /></el-icon>
          </div>
          <el-form-item label="目标币种 (To)" prop="toCurrency">
            <el-input
              v-model="form.toCurrency"
              placeholder="如 CNY"
              maxlength="8"
              style="text-transform: uppercase"
            />
          </el-form-item>
        </div>

        <el-form-item label="汇率 (1 From = ? To)" prop="rate">
          <el-input v-model="form.rate" placeholder="如 7.2453" type="number" step="0.0001" />
        </el-form-item>

        <div class="actions">
          <el-button @click="router.push('/home')">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="submit"
            :style="{ background: 'var(--brand-grad)', border: 'none' }"
          >
            提交汇率
          </el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>

<style scoped>
.form-card {
  max-width: 720px;
  margin: 0 auto;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  align-items: center;
  gap: 8px;
}
.arrow {
  text-align: center;
  margin-top: 30px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .arrow {
    margin: 0;
    transform: rotate(90deg);
  }
}
</style>