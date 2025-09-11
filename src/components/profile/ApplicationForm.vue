<template>
  <div class="content-section">
    <div class="form-header">
      <h2 class="section-title">
        申请 {{ selectedRecruit?.name || '招聘' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回列表
      </button>
    </div>
    
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-title">个人信息</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
      <div class="step" :class="{ active: currentStep === 2 }">
        <div class="step-number">2</div>
        <div class="step-title">简历详情</div>
      </div>
    </div>
    
    <!-- 第一步：个人信息 -->
    <form v-if="currentStep === 1" @submit.prevent="handleStep1Submit" class="edit-form">
      <div class="form-section">
        <h3 class="section-subtitle">完善个人信息</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="nickname">昵称 <span class="required">*</span></label>
            <IInput 
              type="text" 
              id="nickname" 
              v-model="userInfoForm.nickname" 
              placeholder="请输入昵称"
              @input="clearUserInfoError('nickname')"
              :class="{ 'error': userInfoErrors.nickname }"
            />
            <span v-if="userInfoErrors.nickname" class="error-message">{{ userInfoErrors.nickname }}</span>
          </div>
          <div class="form-group">
            <label for="realname">真实姓名 <span class="required">*</span></label>
            <IInput 
              type="text" 
              id="realname" 
              v-model="userInfoForm.realname" 
              placeholder="请输入真实姓名"
              @input="clearUserInfoError('realname')"
              :class="{ 'error': userInfoErrors.realname }"
            />
            <span v-if="userInfoErrors.realname" class="error-message">{{ userInfoErrors.realname }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="gender">性别 <span class="required">*</span></label>
            <ISelect 
              id="gender" 
              v-model="userInfoForm.gender"
              @change="clearUserInfoError('gender')"
              :class="{ 'error': userInfoErrors.gender }"
            >
              <option value="" disabled selected>请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </ISelect>
            <span v-if="userInfoErrors.gender" class="error-message">{{ userInfoErrors.gender }}</span>
          </div>
          <div class="form-group">
            <label for="student_id">学号 <span class="required">*</span></label>
            <IInput 
              type="text" 
              id="student_id" 
              v-model="userInfoForm.student_id" 
              placeholder="请输入学号"
              @input="clearUserInfoError('student_id')"
              :class="{ 'error': userInfoErrors.student_id }"
            />
            <span v-if="userInfoErrors.student_id" class="error-message">{{ userInfoErrors.student_id }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="department">学院 <span class="required">*</span></label>
            <IInput 
              type="text" 
              id="department" 
              v-model="userInfoForm.department" 
              placeholder="请输入学院"
              @input="clearUserInfoError('department')"
              :class="{ 'error': userInfoErrors.department }"
            />
            <span v-if="userInfoErrors.department" class="error-message">{{ userInfoErrors.department }}</span>
          </div>
          <div class="form-group">
            <label for="major">专业 <span class="required">*</span></label>
            <IInput 
              type="text" 
              id="major" 
              v-model="userInfoForm.major" 
              placeholder="请输入专业"
              @input="clearUserInfoError('major')"
              :class="{ 'error': userInfoErrors.major }"
            />
            <span v-if="userInfoErrors.major" class="error-message">{{ userInfoErrors.major }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="grade">年级 <span class="required">*</span></label>
            <ISelect 
              id="grade" 
              v-model="userInfoForm.grade"
              @change="clearUserInfoError('grade')"
              :class="{ 'error': userInfoErrors.grade }"
            >
              <option value="" disabled selected>请选择年级</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </ISelect>
            <span v-if="userInfoErrors.grade" class="error-message">{{ userInfoErrors.grade }}</span>
          </div>
          <div class="form-group">
            <label for="rank">学历 <span class="required">*</span></label>
            <ISelect 
              id="rank" 
              v-model="userInfoForm.rank"
              @change="clearUserInfoError('rank')"
              :class="{ 'error': userInfoErrors.rank }"
            >
              <option value="" disabled selected>请选择学历</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </ISelect>
            <span v-if="userInfoErrors.rank" class="error-message">{{ userInfoErrors.rank }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="phone_number">手机号码</label>
            <IInput 
              type="tel" 
              id="phone_number" 
              v-model="userInfoForm.phone_number" 
              placeholder="请输入手机号码"
              @input="clearUserInfoError('phone_number')"
              :class="{ 'error': userInfoErrors.phone_number }"
            />
            <span v-if="userInfoErrors.phone_number" class="error-message">{{ userInfoErrors.phone_number }}</span>
          </div>
          <div class="form-group">
            <!-- Empty space for grid alignment -->
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isStep1Submitting">
          {{ isStep1Submitting ? '保存中...' : '下一步' }}
        </button>
        <button type="button" class="cancel-btn" @click="handleBack">
          取消
        </button>
      </div>
    </form>
    
    <!-- 第二步：简历详情 -->
    <form v-else-if="currentStep === 2" @submit.prevent="handleStep2Submit" class="edit-form" enctype="multipart/form-data">
      <!-- 志愿选择部分 -->
      <div class="form-section">
        <h3 class="section-subtitle">志愿选择</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="app-first-choice">第一志愿 <span class="required">*</span></label>
            <ISelect id="app-first-choice" v-model="applicationForm.first_choice" required>
              <option value="" disabled selected>请选择第一志愿</option>
              <option v-for="position in positions" :key="position" :value="position">
                {{ position }}
              </option>
            </ISelect>
          </div>
          <div class="form-group">
            <label for="app-second-choice">第二志愿</label>
            <ISelect id="app-second-choice" v-model="applicationForm.second_choice">
              <option value="">无</option>
              <option v-for="position in secondStagePositions" :key="position" :value="position">
                {{ position }}
              </option>
            </ISelect>
          </div>
        </div>
      </div>

      <!-- 详细信息部分 -->
      <div class="form-section">
        <h3 class="section-subtitle">详细信息</h3>
        <div class="form-group full-width">
          <label for="app-self-intro">自我介绍 <span class="required">*</span></label>
          <textarea 
            id="app-self-intro" 
            v-model="applicationForm.self_intro" 
            placeholder="请详细描述您的个人经历、实习经验、项目经验、获得的奖项和荣誉等..."
            rows="5"
            required
          ></textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="app-skills">技能 <span class="required">*</span></label>
          <textarea 
            id="app-skills" 
            v-model="applicationForm.skills" 
            placeholder="请描述您掌握的专业技能，如编程语言、软件工具、硬件设备等..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="app-projects">项目经历 <span class="required">*</span></label>
          <textarea 
            id="app-projects" 
            v-model="applicationForm.projects" 
            placeholder="请描述您参与过的项目经历..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="app-awards">获奖经历 <span class="required">*</span></label>
          <textarea 
            id="app-awards" 
            v-model="applicationForm.awards" 
            placeholder="请描述您获得的奖项和荣誉..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="app-grade-point">绩点</label>
            <IInput 
              type="text" 
              id="app-grade-point" 
              v-model="applicationForm.grade_point" 
              placeholder="请输入绩点（如：3.8）"
            />
          </div>
          <div class="form-group">
            <label for="app-grade-rank">成绩排名</label>
            <IInput 
              type="text" 
              id="app-grade-rank" 
              v-model="applicationForm.grade_rank" 
              placeholder="请输入成绩排名（如：5%）"
            />
          </div>
        </div>
        
        <div class="form-group full-width">
          <label for="app-real-head-img">正面照 <span class="required">*</span></label>
          <div class="file-upload-container">
            <FileUpload 
              class="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800"
              title="上传正面照"
              description="请上传您的正面照片，支持 JPG、PNG、GIF 格式，文件大小不超过 5MB"
              @onChange="handleHeadImgChange"
            >
              <FileUploadGrid />
            </FileUpload>
          </div>
        </div>
        
        <div class="form-group full-width">
          <label for="app-additional-file">附加文件</label>
          <div class="file-upload-container">
            <FileUpload 
              class="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800"
              title="上传附加文件"
              description="支持 PDF、DOC、DOCX 格式，文件大小不超过 10MB"
              @onChange="handleFileChange"
            >
              <FileUploadGrid />
            </FileUpload>
          </div>
        </div>
      </div>
      
        <div class="form-actions">
          <button type="button" class="prev-btn" @click="goToPreviousStep">
            ← 上一步
          </button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '提交申请' }}
          </button>
          <button type="button" class="cancel-btn" @click="handleBack">
            取消
          </button>
        </div>
      </form>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { authAPI } from '@/api/auth.js'
import IInput from '@/components/inspira/IInput.vue'
import ISelect from '@/components/inspira/ISelect.vue'
import FileUpload from '@/components/inspira/FileUpload.vue'
import FileUploadGrid from '@/components/inspira/FileUploadGrid.vue'

const props = defineProps({
  selectedRecruit: {
    type: Object,
    default: () => null
  },
  positions: {
    type: Array,
    default: () => []
  },
  secondStagePositions: {
    type: Array,
    default: () => []
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  userInfo: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['submit', 'back', 'user-info-updated'])

// 当前步骤
const currentStep = ref(1)
const isStep1Submitting = ref(false)

// 用户信息表单数据
const userInfoForm = reactive({
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

// 用户信息表单验证错误
const userInfoErrors = reactive({
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

// 重置表单
const resetForm = () => {
  currentStep.value = 1
  Object.assign(applicationForm, {
    recruit_id: '',
    first_choice: '',
    second_choice: '',
    self_intro: '',
    skills: '',
    projects: '',
    awards: '',
    grade_point: '',
    grade_rank: '',
    real_head_img: null,
    additional_file: null
  })
  // 重置用户信息表单
  Object.assign(userInfoForm, {
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
}

// 暴露重置方法给父组件
defineExpose({
  resetForm
})

// 投递表单数据
const applicationForm = reactive({
  recruit_id: '',
  first_choice: '',
  second_choice: '',
  self_intro: '',
  skills: '',
  projects: '',
  awards: '',
  grade_point: '',
  grade_rank: '',
  real_head_img: null,
  additional_file: null
})

// 监听选中的招聘批次变化
watch(() => props.selectedRecruit, (newRecruit) => {
  if (newRecruit) {
    applicationForm.recruit_id = newRecruit.recruit_id
  }
}, { immediate: true })

// 监听用户信息变化，更新表单
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    Object.assign(userInfoForm, newUserInfo)
  }
}, { immediate: true })

// 清除用户信息字段错误
const clearUserInfoError = (field) => {
  userInfoErrors[field] = ''
}

// 验证用户信息表单
const validateUserInfoForm = () => {
  let isValid = true
  
  // 清空之前的错误信息
  Object.keys(userInfoErrors).forEach(key => {
    userInfoErrors[key] = ''
  })
  
  // 验证昵称
  if (!userInfoForm.nickname?.trim()) {
    userInfoErrors.nickname = '请输入昵称'
    isValid = false
  }
  
  // 验证真实姓名
  if (!userInfoForm.realname?.trim()) {
    userInfoErrors.realname = '请输入真实姓名'
    isValid = false
  }
  
  // 验证性别
  if (!userInfoForm.gender) {
    userInfoErrors.gender = '请选择性别'
    isValid = false
  }
  
  // 验证学号
  if (!userInfoForm.student_id?.trim()) {
    userInfoErrors.student_id = '请输入学号'
    isValid = false
  }
  
  // 验证学院
  if (!userInfoForm.department?.trim()) {
    userInfoErrors.department = '请输入学院'
    isValid = false
  }
  
  // 验证专业
  if (!userInfoForm.major?.trim()) {
    userInfoErrors.major = '请输入专业'
    isValid = false
  }
  
  // 验证年级
  if (!userInfoForm.grade) {
    userInfoErrors.grade = '请选择年级'
    isValid = false
  }
  
  // 验证学历
  if (!userInfoForm.rank) {
    userInfoErrors.rank = '请选择学历'
    isValid = false
  }
  
  // 验证手机号码（非必填，但如果填写了需要验证格式）
  if (userInfoForm.phone_number?.trim() && !/^1[3-9]\d{9}$/.test(userInfoForm.phone_number.trim())) {
    userInfoErrors.phone_number = '请输入正确的手机号码格式'
    isValid = false
  }
  
  return isValid
}

// 处理第一步提交（用户信息更新）
const handleStep1Submit = async () => {
  if (!validateUserInfoForm()) {
    return
  }
  
  isStep1Submitting.value = true
  try {
    // 过滤掉空值
    const updateData = Object.fromEntries(
      Object.entries(userInfoForm).filter(([_, value]) => value !== '')
    )
    
    const result = await authAPI.updateUserInfo(updateData)
    if (result.success) {
      // 更新成功，通知父组件刷新用户信息
      emit('user-info-updated')
      // 进入第二步
      currentStep.value = 2
    } else {
      alert('更新失败：' + result.error)
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    alert('更新失败，请稍后重试')
  } finally {
    isStep1Submitting.value = false
  }
}

// 处理第二步提交（简历提交）
const handleStep2Submit = () => {
  emit('submit', applicationForm)
}

// 返回上一步
const goToPreviousStep = () => {
  currentStep.value = 1
}

const handleBack = () => {
  emit('back')
}

// 处理正面照文件选择
const handleHeadImgChange = (files) => {
  const file = files[files.length - 1] // 取最后一个文件
  if (file) {
    // 检查文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      alert('正面照文件大小不能超过 5MB')
      return
    }
    
    // 检查文件类型（基于文件扩展名）
    const fileName = file.name.toLowerCase()
    const allowedExtensions = ['.jpg', '.jpeg', '.png']
    const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext))
    if (!isValidType) {
      alert('正面照只支持 JPG、PNG格式的图片')
      return
    }
    
    applicationForm.real_head_img = file
  }
}

// 处理附加文件选择
const handleFileChange = (files) => {
  const file = files[files.length - 1] // 取最后一个文件
  if (file) {
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      return
    }
    
    // 检查文件类型（基于文件扩展名）
    const fileName = file.name.toLowerCase()
    const allowedExtensions = ['.pdf', '.doc', '.docx']
    const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext))
    if (!isValidType) {
      alert('只支持 PDF、DOC、DOCX 格式的文件')
      return
    }
    
    applicationForm.additional_file = file
  }
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

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.edit-form {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #f8b400;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8b400;
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

.form-group.full-width {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
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

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group textarea:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
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

/* 步骤指示器样式 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #e1e5e9;
  background: #f8f9fa;
  color: #6c757d;
}

.step.active .step-number {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
  color: white;
  border-color: #f8b400;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.step.completed .step-number {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.3s ease;
}

.step.active .step-title {
  color: #f8b400;
  font-weight: 600;
}

.step.completed .step-title {
  color: #28a745;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e1e5e9;
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.step-line.completed {
  background: linear-gradient(135deg, #f8b400 0%, #ff6b35 100%);
}

/* 错误状态样式 */
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

/* 上一步按钮样式 */
.prev-btn {
  padding: 0.75rem 2rem;
  border: 2px solid #f8b400;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #f8b400;
}

.prev-btn:hover {
  background: #f8b400;
  color: white;
  transform: translateY(-2px);
}

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  cursor: pointer;
}

.file-input:focus {
  outline: none;
  border-color: #f8b400;
  background: white;
  box-shadow: 0 0 0 3px rgba(248, 180, 0, 0.1);
}

.file-upload-container {
  margin: 0.5rem 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.file-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  margin-bottom: 0;
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
  
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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
