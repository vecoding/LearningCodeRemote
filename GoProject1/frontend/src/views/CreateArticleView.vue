<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createArticle } from '@/api/articles'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  title: '',
  preview: '',
  content: ''
})

const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 80, message: '标题长度 2-80 字', trigger: 'blur' }
  ],
  preview: [
    { required: true, message: '请输入文章预览', trigger: 'blur' },
    { max: 200, message: '预览不超过 200 字', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 5, message: '内容至少 5 个字符', trigger: 'blur' }
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
    const created = await createArticle({ ...form })
    ElMessage.success('发布成功')
    if (created?.ID) {
      router.push(`/articles/${created.ID}`)
    } else {
      router.push('/articles')
    }
  } catch {
    /* 拦截器已处理 */
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="page-title">发布文章</h1>
    <p class="page-subtitle">填写标题、预览与正文，提交后将立即出现在文章列表。</p>

    <div class="section-card form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="给文章起一个吸引人的标题"
            maxlength="80"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="预览" prop="preview">
          <el-input
            v-model="form.preview"
            type="textarea"
            :rows="2"
            placeholder="一句话概括文章内容，会显示在列表卡片上"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="12"
            placeholder="支持换行；可以分段书写你的内容"
          />
        </el-form-item>
        <div class="actions">
          <el-button @click="router.push('/articles')">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="submit"
            :style="{ background: 'var(--brand-grad)', border: 'none' }"
          >
            发布
          </el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>

<style scoped>
.form-card {
  max-width: 820px;
  margin: 0 auto;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>