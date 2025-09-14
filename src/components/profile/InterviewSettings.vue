<template>
  <div class="interview-settings">
    <div class="settings-header">
      <h3 class="settings-title">
        <span class="title-icon">⚙️</span>
        面试预约时间设置
      </h3>
      <p class="settings-description">
        设置学生可以预约面试的时间段
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载面试设置...</p>
    </div>

    <!-- 设置表单 -->
    <div v-else class="settings-form">
      <form @submit.prevent="submitSettings">
        <div class="form-group">
          <label class="form-label" for="book-start-time">
            <span class="label-icon">📅</span>
            预约开始时间
          </label>
          <input
            id="book-start-time"
            v-model="formData.book_start_time"
            type="datetime-local"
            class="form-input"
            :class="{ error: errors.book_start_time }"
            required
          />
          <span v-if="errors.book_start_time" class="error-message">
            {{ errors.book_start_time }}
          </span>
          <small class="form-help">
            学生从这个时间开始可以预约面试
          </small>
        </div>

        <div class="form-group">
          <label class="form-label" for="book-end-time">
            <span class="label-icon">📅</span>
            预约结束时间
          </label>
          <input
            id="book-end-time"
            v-model="formData.book_end_time"
            type="datetime-local"
            class="form-input"
            :class="{ error: errors.book_end_time }"
            required
          />
          <span v-if="errors.book_end_time" class="error-message">
            {{ errors.book_end_time }}
          </span>
          <small class="form-help">
            学生只能在这个时间前完成面试预约
          </small>
        </div>

        <!-- 当前设置显示 -->
        <div v-if="currentSettings.book_start_time" class="current-settings">
          <h4 class="current-title">当前设置</h4>
          <div class="current-info">
            <div class="info-item">
              <strong>预约开始:</strong> 
              {{ formatDateTime(currentSettings.book_start_time) }}
            </div>
            <div class="info-item">
              <strong>预约结束:</strong> 
              {{ formatDateTime(currentSettings.book_end_time) }}
            </div>
            <div class="info-item status-item">
              <strong>当前状态:</strong> 
              <span :class="getStatusClass()">
                {{ getStatusText() }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button
            type="button"
            @click="resetForm"
            class="btn-secondary"
            :disabled="submitting"
          >
            重置
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="submitting || !formValid"
          >
            <span v-if="submitting" class="loading-spinner small"></span>
            {{ submitting ? '保存中...' : '保存设置' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 时间验证提示 -->
    <div class="validation-tips">
      <h4 class="tips-title">⚠️ 注意事项</h4>
      <ul class="tips-list">
        <li>预约开始时间应早于预约结束时间</li>
        <li>建议给学生留出足够的时间来预约面试</li>
        <li>修改时间设置后，已有的预约不会受到影响</li>
        <li>只有在预约时间段内，学生才能进行面试预约</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAlert } from '@/composables/useAlert'

const props = defineProps({
  recruitId: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['settings-updated'])

const { showAlert } = useAlert()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const currentSettings = reactive({
  book_start_time: '',
  book_end_time: ''
})

const formData = reactive({
  book_start_time: '',
  book_end_time: ''
})

const errors = reactive({
  book_start_time: '',
  book_end_time: ''
})

// 计算属性
const formValid = computed(() => {
  return formData.book_start_time && 
         formData.book_end_time && 
         !errors.book_start_time && 
         !errors.book_end_time
})

// 监听表单数据变化进行验证
watch(() => [formData.book_start_time, formData.book_end_time], () => {
  validateForm()
}, { deep: true })

// 监听招聘ID变化
watch(() => props.recruitId, (newId) => {
  if (newId) {
    fetchCurrentSettings()
  }
}, { immediate: true })

// 表单验证
const validateForm = () => {
  // 清空之前的错误
  errors.book_start_time = ''
  errors.book_end_time = ''

  if (!formData.book_start_time || !formData.book_end_time) {
    return
  }

  const startTime = new Date(formData.book_start_time)
  const endTime = new Date(formData.book_end_time)

  if (startTime >= endTime) {
    errors.book_start_time = '预约开始时间必须早于结束时间'
    errors.book_end_time = '预约结束时间必须晚于开始时间'
  }

  // 检查时间是否过于接近
  const timeDiff = endTime.getTime() - startTime.getTime()
  const minDuration = 30 * 60 * 1000 // 30分钟
  
  if (timeDiff < minDuration) {
    errors.book_end_time = '预约时间段至少需要30分钟'
  }
}

// 获取当前设置
const fetchCurrentSettings = async () => {
  if (!props.recruitId) return
  
  loading.value = true
  try {
    // 这里应该有一个API来获取当前设置，但API文档中没有，所以我们模拟一下
    // 实际实现时需要后端提供对应的API
    const response = await fetch(`/api/admin/interview/settings/${props.recruitId}`)
    const result = await response.json()
    
    if (result.success && result.data) {
      currentSettings.book_start_time = result.data.book_start_time || ''
      currentSettings.book_end_time = result.data.book_end_time || ''
      
      // 将当前设置填入表单
      formData.book_start_time = formatDateTimeForInput(currentSettings.book_start_time)
      formData.book_end_time = formatDateTimeForInput(currentSettings.book_end_time)
    }
  } catch (error) {
    console.error('获取面试设置失败:', error)
    // showAlert('获取面试设置失败: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// 提交设置
const submitSettings = async () => {
  if (!formValid.value) {
    showAlert('请检查表单输入', 'warning')
    return
  }

  submitting.value = true
  try {
    const response = await fetch(`/api/admin/interview/settings/${props.recruitId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_start_time: formatDateTimeForBackend(formData.book_start_time),
        book_end_time: formatDateTimeForBackend(formData.book_end_time)
      }),
    })

    const result = await response.json()

    if (result.success) {
      // 更新当前设置
      currentSettings.book_start_time = formData.book_start_time
      currentSettings.book_end_time = formData.book_end_time
      
      showAlert('面试预约时间设置已保存', 'success')
      emit('settings-updated')
    } else {
      throw new Error(result.error || '保存失败')
    }
  } catch (error) {
    console.error('保存面试设置失败:', error)
    showAlert('保存失败: ' + error.message, 'error')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (currentSettings.book_start_time) {
    formData.book_start_time = formatDateTimeForInput(currentSettings.book_start_time)
    formData.book_end_time = formatDateTimeForInput(currentSettings.book_end_time)
  } else {
    formData.book_start_time = ''
    formData.book_end_time = ''
  }
  
  errors.book_start_time = ''
  errors.book_end_time = ''
}

// 格式化日期时间显示
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '未设置'
  
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateTimeStr))
  } catch (error) {
    return dateTimeStr
  }
}

// 格式化日期时间为输入框格式
const formatDateTimeForInput = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  
  try {
    const date = new Date(dateTimeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return ''
  }
}

// 格式化日期时间为后端需要的格式
const formatDateTimeForBackend = (dateTimeLocal) => {
  try {
    const date = new Date(dateTimeLocal)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('时间格式转换错误:', error)
    return ''
  }
}

// 获取当前状态文本
const getStatusText = () => {
  if (!currentSettings.book_start_time || !currentSettings.book_end_time) {
    return '未设置'
  }
  
  const now = new Date()
  const startTime = new Date(currentSettings.book_start_time)
  const endTime = new Date(currentSettings.book_end_time)
  
  if (now < startTime) {
    return '预约未开始'
  } else if (now <= endTime) {
    return '预约进行中'
  } else {
    return '预约已结束'
  }
}

// 获取状态样式类
const getStatusClass = () => {
  const status = getStatusText()
  if (status === '预约进行中') {
    return 'status-active'
  } else if (status === '预约未开始') {
    return 'status-pending'
  } else {
    return 'status-inactive'
  }
}

// 组件挂载时获取数据
onMounted(() => {
  if (props.recruitId) {
    fetchCurrentSettings()
  }
})
</script>

<style scoped>
.interview-settings {
  max-width: 800px;
}

.settings-header {
  margin-bottom: 2rem;
  text-align: center;
}

.settings-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.3rem;
}

.settings-description {
  color: #666;
  margin: 0;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #f8b400;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0 0.5rem 0 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.settings-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.label-icon {
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-help {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.current-settings {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
}

.current-title {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.current-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.info-item {
  font-size: 0.9rem;
  color: #666;
}

.info-item strong {
  color: #333;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-active {
  color: #28a745;
  font-weight: 600;
}

.status-pending {
  color: #ffc107;
  font-weight: 600;
}

.status-inactive {
  color: #6c757d;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #f8b400;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #e09900;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 2px solid #dee2e6;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.validation-tips {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
}

.tips-title {
  color: #856404;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.tips-list {
  color: #856404;
  margin: 0;
  padding-left: 1.5rem;
}

.tips-list li {
  margin-bottom: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-settings {
    max-width: none;
  }
  
  .settings-form {
    padding: 1.5rem;
  }
  
  .current-info {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
