<template>
  <div class="recruit-form-container">
    <div class="form-header">
      <h3>{{ isEditing ? '编辑招聘批次' : '新增招聘批次' }}</h3>
      <button class="close-btn" @click="handleCancel" type="button">
        <span>✕</span>
      </button>
    </div>
    
    <form @submit.prevent="handleSubmit" class="recruit-form">
      <!-- 招聘名称 -->
      <div class="form-group">
        <label for="name" class="form-label">
          <span class="label-text">招聘名称</span>
          <span class="required">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="请输入招聘批次名称（如：2025秋季招新）"
          required
          maxlength="100"
        >
      </div>

      <!-- 招聘时间 -->
      <div class="form-row">
        <div class="form-group">
          <label for="start_time" class="form-label">
            <span class="label-text">开始时间</span>
            <span class="required">*</span>
          </label>
          <input
            id="start_time"
            v-model="formData.start_time"
            type="datetime-local"
            class="form-input"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="end_time" class="form-label">
            <span class="label-text">结束时间</span>
            <span class="required">*</span>
          </label>
          <input
            id="end_time"
            v-model="formData.end_time"
            type="datetime-local"
            class="form-input"
            required
          >
        </div>
      </div>

      <!-- 招聘描述 -->
      <div class="form-group">
        <label for="description" class="form-label">
          <span class="label-text">招聘描述</span>
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form-textarea"
          placeholder="请输入招聘的详细描述，包括招聘要求、福利待遇等信息..."
          rows="5"
          maxlength="2000"
        ></textarea>
        <div class="char-count">
          {{ formData.description.length }}/2000
        </div>
      </div>

      <!-- 发布状态 -->
      <div class="form-group">
        <label class="form-label">
          <span class="label-text">发布状态</span>
        </label>
        <div class="toggle-group">
          <label class="toggle-option">
            <input
              v-model="formData.is_active"
              type="radio"
              :value="true"
              name="is_active"
            >
            <span class="toggle-label active">
              <span class="toggle-icon">🟢</span>
              立即发布
            </span>
          </label>
          <label class="toggle-option">
            <input
              v-model="formData.is_active"
              type="radio"
              :value="false"
              name="is_active"
            >
            <span class="toggle-label inactive">
              <span class="toggle-icon">🔴</span>
              保存草稿
            </span>
          </label>
        </div>
        <div class="field-hint">
          立即发布后用户可以看到并投递此招聘，保存草稿则暂不对外展示
        </div>
      </div>

      <!-- 表单操作按钮 -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="handleCancel" :disabled="isSubmitting">
          取消
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !isFormValid">
          <span v-if="isSubmitting">{{ isEditing ? '更新中...' : '创建中...' }}</span>
          <span v-else>{{ isEditing ? '更新招聘' : '创建招聘' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  recruitData: {
    type: Object,
    default: () => null
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 表单数据
const formData = ref({
  name: '',
  start_time: '',
  end_time: '',
  description: '',
  is_active: false
})

// 格式化日期时间为input[type="datetime-local"]所需的格式
const formatDateTimeForInput = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
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

// 表单验证
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' &&
         formData.value.start_time !== '' &&
         formData.value.end_time !== '' &&
         new Date(formData.value.start_time) < new Date(formData.value.end_time)
})

// 监听招聘数据变化，用于编辑模式
watch([() => props.recruitData, () => props.isEditing], ([newData, isEditing]) => {
  if (newData && isEditing) {
    // 将后端返回的时间格式转换为datetime-local格式
    formData.value = {
      name: newData.name || '',
      start_time: formatDateTimeForInput(newData.start_time) || '',
      end_time: formatDateTimeForInput(newData.end_time) || '',
      description: newData.description || '',
      is_active: Boolean(newData.is_active)
    }
  } else if (!isEditing) {
    // 新增模式，重置表单
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    formData.value = {
      name: '',
      start_time: formatDateTimeForInput(now.toISOString()),
      end_time: formatDateTimeForInput(tomorrow.toISOString()),
      description: '',
      is_active: false
    }
  }
}, { immediate: true })

// 处理表单提交
const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('请检查表单填写是否正确')
    return
  }

  // 验证时间范围
  const startTime = new Date(formData.value.start_time)
  const endTime = new Date(formData.value.end_time)
  
  if (startTime >= endTime) {
    alert('结束时间必须晚于开始时间')
    return
  }

  // 转换为后端需要的格式（YYYY-MM-DD HH:mm:ss）
  const submitData = {
    name: formData.value.name.trim(),
    start_time: formatDateTimeForBackend(formData.value.start_time),
    end_time: formatDateTimeForBackend(formData.value.end_time),
    description: formData.value.description.trim(),
    is_active: formData.value.is_active
  }

  emit('submit', submitData)
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
    console.error('日期格式化错误:', error)
    return dateTimeLocal
  }
}

// 处理取消操作
const handleCancel = () => {
  emit('cancel')
}

// 已移至watch中处理初始化
</script>

<style scoped>
.recruit-form-container {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.form-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(108, 117, 125, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6c757d;
}

.close-btn:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.recruit-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.label-text {
  margin-right: 0.25rem;
}

.required {
  color: #dc3545;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
  background: #fff;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #f8b400;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.toggle-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.toggle-option {
  cursor: pointer;
}

.toggle-option input[type="radio"] {
  display: none;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.toggle-option input[type="radio"]:checked + .toggle-label {
  border-color: #f8b400;
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
}

.toggle-label.active {
  color: #28a745;
}

.toggle-label.inactive {
  color: #6c757d;
}

.toggle-option input[type="radio"]:checked + .toggle-label.active {
  border-color: #28a745;
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.toggle-option input[type="radio"]:checked + .toggle-label.inactive {
  border-color: #6c757d;
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.toggle-icon {
  font-size: 1rem;
}

.field-hint {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #f8b400 0%, #f39c12 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recruit-form-container {
    width: 95vw;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .form-header {
    padding: 1rem 1.5rem;
  }
  
  .recruit-form {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .toggle-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* 表单验证错误提示样式 */
.form-input:invalid,
.form-textarea:invalid {
  border-color: #dc3545;
}

.form-input:invalid:focus,
.form-textarea:invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}
</style>
