<template>
  <div class="content-section">
    <h2 class="section-title">修改信息</h2>
    <form @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-row">
        <div class="form-group">
          <label for="nickname">昵称 <span class="required">*</span></label>
          <IInput 
            type="text" 
            id="nickname" 
            v-model="editForm.nickname" 
            placeholder="请输入昵称"
            @input="clearError('nickname')"
            :class="{ 'error': formErrors.nickname }"
          />
          <span v-if="formErrors.nickname" class="error-message">{{ formErrors.nickname }}</span>
        </div>
        <div class="form-group">
          <label for="realname">真实姓名 <span class="required">*</span></label>
          <IInput 
            type="text" 
            id="realname" 
            v-model="editForm.realname" 
            placeholder="请输入真实姓名"
            @input="clearError('realname')"
            :class="{ 'error': formErrors.realname }"
          />
          <span v-if="formErrors.realname" class="error-message">{{ formErrors.realname }}</span>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="gender">性别 <span class="required">*</span></label>
          <ISelect 
            id="gender" 
            v-model="editForm.gender"
            @change="clearError('gender')"
            :class="{ 'error': formErrors.gender }"
          >
            <option value="" disabled selected>请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </ISelect>
          <span v-if="formErrors.gender" class="error-message">{{ formErrors.gender }}</span>
        </div>
        <div class="form-group">
          <label for="student_id">学号 <span class="required">*</span></label>
          <IInput 
            type="text" 
            id="student_id" 
            v-model="editForm.student_id" 
            placeholder="请输入学号"
            @input="clearError('student_id')"
            :class="{ 'error': formErrors.student_id }"
          />
          <span v-if="formErrors.student_id" class="error-message">{{ formErrors.student_id }}</span>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="department">学院 <span class="required">*</span></label>
          <IInput 
            type="text" 
            id="department" 
            v-model="editForm.department" 
            placeholder="请输入学院"
            @input="clearError('department')"
            :class="{ 'error': formErrors.department }"
          />
          <span v-if="formErrors.department" class="error-message">{{ formErrors.department }}</span>
        </div>
        <div class="form-group">
          <label for="major">专业 <span class="required">*</span></label>
          <IInput 
            type="text" 
            id="major" 
            v-model="editForm.major" 
            placeholder="请输入专业"
            @input="clearError('major')"
            :class="{ 'error': formErrors.major }"
          />
          <span v-if="formErrors.major" class="error-message">{{ formErrors.major }}</span>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="grade">年级 <span class="required">*</span></label>
          <ISelect 
            id="grade" 
            v-model="editForm.grade"
            @change="clearError('grade')"
            :class="{ 'error': formErrors.grade }"
          >
            <option value="" disabled selected>请选择年级</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </ISelect>
          <span v-if="formErrors.grade" class="error-message">{{ formErrors.grade }}</span>
        </div>
        <div class="form-group">
          <label for="rank">学历 <span class="required">*</span></label>
          <ISelect 
            id="rank" 
            v-model="editForm.rank"
            @change="clearError('rank')"
            :class="{ 'error': formErrors.rank }"
          >
            <option value="" disabled selected>请选择学历</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
          </ISelect>
          <span v-if="formErrors.rank" class="error-message">{{ formErrors.rank }}</span>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="phone_number">手机号码</label>
          <IInput 
            type="tel" 
            id="phone_number" 
            v-model="editForm.phone_number" 
            placeholder="请输入手机号码"
            @input="clearError('phone_number')"
            :class="{ 'error': formErrors.phone_number }"
          />
          <span v-if="formErrors.phone_number" class="error-message">{{ formErrors.phone_number }}</span>
        </div>
        <div class="form-group">
          <!-- Empty space for grid alignment -->
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
        <button type="button" class="cancel-btn" @click="handleCancel">
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import IInput from '@/components/inspira/IInput.vue'
import ISelect from '@/components/inspira/ISelect.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 编辑表单数据
const editForm = reactive({
  nickname: '',
  gender: '',
  realname: '',
  student_id: '',
  department: '',
  major: '',
  grade: '',
  rank: '',
  phone_number: ''
})

// 表单验证错误信息
const formErrors = reactive({
  nickname: '',
  gender: '',
  realname: '',
  student_id: '',
  department: '',
  major: '',
  grade: '',
  rank: '',
  phone_number: ''
})

// 监听用户信息变化，更新表单
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    Object.assign(editForm, newUserInfo)
  }
}, { immediate: true })

// 清除特定字段的错误信息
const clearError = (field) => {
  formErrors[field] = ''
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 清空之前的错误信息
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  // 验证昵称
  if (!editForm.nickname?.trim()) {
    formErrors.nickname = '请输入昵称'
    isValid = false
  }
  
  // 验证真实姓名
  if (!editForm.realname?.trim()) {
    formErrors.realname = '请输入真实姓名'
    isValid = false
  }
  
  // 验证性别
  if (!editForm.gender) {
    formErrors.gender = '请选择性别'
    isValid = false
  }
  
  // 验证学号
  if (!editForm.student_id?.trim()) {
    formErrors.student_id = '请输入学号'
    isValid = false
  }
  
  // 验证学院
  if (!editForm.department?.trim()) {
    formErrors.department = '请输入学院'
    isValid = false
  }
  
  // 验证专业
  if (!editForm.major?.trim()) {
    formErrors.major = '请输入专业'
    isValid = false
  }
  
  // 验证年级
  if (!editForm.grade) {
    formErrors.grade = '请选择年级'
    isValid = false
  }
  
  // 验证学历
  if (!editForm.rank) {
    formErrors.rank = '请选择学历'
    isValid = false
  }
  
  // 验证手机号码（可选，但如果填写则需要格式正确）
  if (editForm.phone_number?.trim() && !/^1[3-9]\d{9}$/.test(editForm.phone_number.trim())) {
    formErrors.phone_number = '请输入正确的手机号码格式'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', editForm)
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8b400;
  flex-shrink: 0;
}

.edit-form {
  max-width: 800px;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #e74c3c;
  background-color: #fdf2f2;
}

.form-group input.error:focus,
.form-group select.error:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.submit-btn,
.cancel-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(248, 180, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* 滚动条样式 */
.edit-form::-webkit-scrollbar {
  width: 6px;
}

.edit-form::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.edit-form::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.edit-form::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .edit-form {
    overflow-y: visible;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
}
</style>

