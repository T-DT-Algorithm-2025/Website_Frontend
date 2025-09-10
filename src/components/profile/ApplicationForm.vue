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
    
    <form @submit.prevent="handleSubmit" class="edit-form" enctype="multipart/form-data">
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
          <input 
            type="file" 
            id="app-real-head-img" 
            @change="handleHeadImgChange"
            accept="image/*"
            class="file-input"
            required
          />
          <p class="file-hint">请上传您的正面照片，支持 JPG、PNG、GIF 格式，文件大小不超过 5MB</p>
        </div>
        
        <div class="form-group full-width">
          <label for="app-additional-file">附加文件</label>
          <input 
            type="file" 
            id="app-additional-file" 
            @change="handleFileChange"
            accept=".pdf,.doc,.docx"
            class="file-input"
          />
          <p class="file-hint">支持 PDF、DOC、DOCX 格式，文件大小不超过 10MB</p>
        </div>
      </div>
      
      <div class="form-actions">
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
import { reactive, watch } from 'vue'
import IInput from '@/components/inspira/IInput.vue'
import ISelect from '@/components/inspira/ISelect.vue'

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
  }
})

const emit = defineEmits(['submit', 'back'])

// 重置表单
const resetForm = () => {
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
  
  // 重置文件输入框
  const headImgInput = document.getElementById('app-real-head-img')
  const additionalFileInput = document.getElementById('app-additional-file')
  if (headImgInput) headImgInput.value = ''
  if (additionalFileInput) additionalFileInput.value = ''
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

const handleSubmit = () => {
  emit('submit', applicationForm)
}

const handleBack = () => {
  emit('back')
}

// 处理正面照文件选择
const handleHeadImgChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      alert('正面照文件大小不能超过 5MB')
      event.target.value = ''
      return
    }
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('正面照只支持 JPG、PNG、GIF 格式的图片')
      event.target.value = ''
      return
    }
    
    applicationForm.real_head_img = file
  }
}

// 处理附加文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      event.target.value = ''
      return
    }
    
    // 检查文件类型
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 PDF、DOC、DOCX 格式的文件')
      event.target.value = ''
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
  max-width: 800px;
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
