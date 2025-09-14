<template>
  <div class="interview-settings">
    <!-- 页面标题 -->
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

    <!-- 设置表单卡片 -->
    <div v-else class="settings-card">
      <form @submit.prevent="submitSettings" class="settings-form">
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
      </form>
    </div>

    <!-- 当前设置显示卡片 -->
    <div class="current-settings-card">
      <h4 class="current-title">
        <span class="title-icon">📊</span>
        当前设置
      </h4>
      <div v-if="settingsLoading" class="loading-indicator">
        <div class="loading-spinner small"></div>
        <span>获取当前设置...</span>
      </div>
      <div v-else-if="currentSettings.book_start_time" class="current-info">
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
      <div v-else class="no-settings">
        <span class="no-settings-icon">⚠️</span>
        <p>暂未设置面试预约时间</p>
        <small>请设置预约开始和结束时间后保存</small>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
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
          @click="submitSettings"
          class="btn-primary"
          :disabled="submitting || !formValid"
        >
          <span v-if="submitting" class="loading-spinner small"></span>
          {{ submitting ? '保存中...' : '保存设置' }}
        </button>
      </div>
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
const settingsLoading = ref(false)
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
  
  settingsLoading.value = true
  try {
    // 使用 /interview/available/<recruit_id> API 来获取当前的面试预约时间设置
    const response = await fetch(`/api/interview/available/${props.recruitId}`)
    const result = await response.json()
    
    if (result.success && result.data) {
      // 检查是否有设置预约时间
      if (result.data.start_time && result.data.end_time) {
        currentSettings.book_start_time = result.data.start_time
        currentSettings.book_end_time = result.data.end_time
        
        // 将当前设置填入表单
        formData.book_start_time = formatDateTimeForInput(currentSettings.book_start_time)
        formData.book_end_time = formatDateTimeForInput(currentSettings.book_end_time)
      } else {
        // 如果API返回但没有时间设置，清空当前设置
        currentSettings.book_start_time = ''
        currentSettings.book_end_time = ''
        formData.book_start_time = ''
        formData.book_end_time = ''
      }
    } else {
      // API调用失败或无数据，清空设置
      currentSettings.book_start_time = ''
      currentSettings.book_end_time = ''
      formData.book_start_time = ''
      formData.book_end_time = ''
    }
  } catch (error) {
    console.error('获取面试设置失败:', error)
    // 清空设置，但不显示错误（避免影响管理员操作）
    currentSettings.book_start_time = ''
    currentSettings.book_end_time = ''
    formData.book_start_time = ''
    formData.book_end_time = ''
  } finally {
    settingsLoading.value = false
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
      currentSettings.book_start_time = formatDateTimeForBackend(formData.book_start_time)
      currentSettings.book_end_time = formatDateTimeForBackend(formData.book_end_time)
      
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
  max-width: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.5rem;
  box-sizing: border-box;
  /* 确保在高缩放比例下能够正确显示 */
  max-height: 100%;
}

.settings-header {
  margin-bottom: 1.5rem;
  text-align: center;
  flex-shrink: 0;
  /* 在高缩放比例时减少间距 */
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

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
  /* 允许适当收缩以适应小空间 */
  flex-shrink: 1;
  min-height: 0;
}

.settings-form {
  padding: 1.5rem;
  /* 在高缩放或小屏幕时调整padding */
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

.current-settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  transition: transform 0.3s ease;
  /* 允许适当收缩以适应小空间 */
  flex-shrink: 1;
  min-height: 0;
}

.current-settings-card:hover {
  transform: translateY(-2px);
}

.current-title {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}

.current-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  transition: background 0.3s ease;
}

.info-item:hover {
  background: #e9ecef;
}

.info-item strong {
  display: block;
  color: #333;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item:not(.status-item) {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.status-active {
  color: #28a745;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-pending {
  color: #ffc107;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-inactive {
  color: #6c757d;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: rgba(108, 117, 125, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.no-settings {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
  background: #fff8e1;
  border-radius: 8px;
  border: 1px dashed #ffc107;
}

.no-settings-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: #ffc107;
}

.no-settings p {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.no-settings small {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.action-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-top: auto;
  /* 按钮区域保持不收缩，但减少padding */
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
  background: linear-gradient(135deg, #f8b400 0%, #e09900 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #e09900 0%, #d08800 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.4);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

/* 高缩放比例优化 */
@media (max-height: 800px), (min-width: 1024px) and (max-height: 1000px) {
  .interview-settings {
    gap: 0.5rem;
  }
  
  .settings-header {
    margin-bottom: 1rem;
  }
  
  .settings-card,
  .current-settings-card {
    margin-bottom: 1rem;
  }
  
  .settings-form,
  .current-settings-card,
  .action-section {
    padding: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .current-info {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .settings-form {
    padding: 1.5rem;
  }
  
  .current-settings-card {
    padding: 1.5rem;
  }
  
  .current-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-item {
    padding: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .no-settings {
    padding: 2rem 1rem;
  }
  
  .no-settings-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .interview-settings {
    padding-right: 0;
  }
  
  .settings-title {
    font-size: 1.3rem;
  }
  
  .settings-form {
    padding: 1rem;
  }
  
  .current-settings-card {
    padding: 1rem;
  }
  
  .current-title {
    font-size: 1.1rem;
  }
}

/* 滚动条样式 */
.interview-settings::-webkit-scrollbar {
  width: 6px;
}

.interview-settings::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.interview-settings::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.interview-settings::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}
</style>
