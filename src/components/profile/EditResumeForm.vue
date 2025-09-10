<template>
  <div class="content-section">
    <div class="form-header">
      <h2 class="section-title">
        修改简历 - {{ selectedRecruit?.name || '招聘批次' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回投递列表
      </button>
    </div>
    
    <!-- 表单内容 -->
    <form @submit.prevent="handleSubmit" class="edit-form" enctype="multipart/form-data">
      <!-- 志愿选择部分 -->
      <div class="form-section">
        <h3 class="section-subtitle">志愿选择</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="edit-first-choice">第一志愿 <span class="required">*</span></label>
            <ISelect id="edit-first-choice" v-model="editForm.first_choice" required>
              <option value="" disabled selected>请选择第一志愿</option>
              <option v-for="position in positions" :key="position" :value="position">
                {{ position }}
              </option>
            </ISelect>
          </div>
          <div class="form-group">
            <label for="edit-second-choice">第二志愿</label>
            <ISelect id="edit-second-choice" v-model="editForm.second_choice">
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
          <label for="edit-self-intro">自我介绍 <span class="required">*</span></label>
          <textarea 
            id="edit-self-intro" 
            v-model="editForm.self_intro" 
            placeholder="请详细描述您的个人经历、实习经验、项目经验、获得的奖项和荣誉等..."
            rows="5"
            required
          ></textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="edit-skills">技能 <span class="required">*</span></label>
          <textarea 
            id="edit-skills" 
            v-model="editForm.skills" 
            placeholder="请描述您掌握的专业技能，如编程语言、软件工具、硬件设备等..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="edit-projects">项目经历 <span class="required">*</span></label>
          <textarea 
            id="edit-projects" 
            v-model="editForm.projects" 
            placeholder="请描述您参与过的项目经历..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="edit-awards">获奖经历 <span class="required">*</span></label>
          <textarea 
            id="edit-awards" 
            v-model="editForm.awards" 
            placeholder="请描述您获得的奖项和荣誉..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="edit-grade-point">绩点</label>
            <IInput 
              type="text" 
              id="edit-grade-point" 
              v-model="editForm.grade_point" 
              placeholder="请输入绩点（如：3.8）"
            />
          </div>
          <div class="form-group">
            <label for="edit-grade-rank">成绩排名</label>
            <IInput 
              type="text" 
              id="edit-grade-rank" 
              v-model="editForm.grade_rank" 
              placeholder="请输入成绩排名（如：5%）"
            />
          </div>
        </div>
        
        <div class="form-group full-width">
          <label for="edit-real-head-img">正面照 <span class="required">*</span></label>
          <div class="file-upload-container">
            <FileUpload 
              class="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800"
              title="更换正面照"
              description="如需更换正面照，请重新上传。支持 JPG、PNG、GIF 格式，文件大小不超过 5MB"
              @onChange="handleHeadImgChange"
            >
              <FileUploadGrid />
            </FileUpload>
          </div>
          <div class="file-change-control">
            <label>
              <input 
                type="checkbox" 
                v-model="editForm.real_head_img_change"
                @change="handleHeadImgChangeToggle"
              >
              更换正面照
            </label>
          </div>
        </div>
        
        <div class="form-group full-width">
          <label for="edit-additional-file">附加文件</label>
          <div class="file-upload-container">
            <FileUpload 
              class="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800"
              title="更换附加文件"
              description="如需更换附加文件，请重新上传。支持 PDF、DOC、DOCX 格式，文件大小不超过 10MB"
              @onChange="handleFileChange"
            >
              <FileUploadGrid />
            </FileUpload>
          </div>
          <div class="file-change-control">
            <label>
              <input 
                type="checkbox" 
                v-model="editForm.additional_file_change"
                @change="handleFileChangeToggle"
              >
              更换附加文件
            </label>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '更新中...' : '更新简历' }}
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
  submissionDetail: {
    type: Object,
    default: () => null
  },
  selectedSubmission: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['submit', 'back'])

// 编辑表单数据
const editForm = reactive({
  first_choice: '',
  second_choice: '',
  self_intro: '',
  skills: '',
  projects: '',
  awards: '',
  grade_point: '',
  grade_rank: '',
  real_head_img: null,
  additional_file: null,
  real_head_img_change: false,
  additional_file_change: false
})

// 监听投递详情变化，填充表单
watch(() => props.submissionDetail, (newDetail) => {
  if (newDetail && newDetail.info) {
    const info = newDetail.info
    editForm.first_choice = info.first_choice || ''
    editForm.second_choice = info.second_choice || ''
    editForm.self_intro = info.self_intro || ''
    editForm.skills = info.skills || ''
    editForm.projects = info.projects || ''
    editForm.awards = info.awards || ''
    editForm.grade_point = info.grade_point || ''
    editForm.grade_rank = info.grade_rank || ''
    // 重置文件变更状态
    editForm.real_head_img_change = false
    editForm.additional_file_change = false
    editForm.real_head_img = null
    editForm.additional_file = null
  }
}, { immediate: true })

const handleBack = () => {
  emit('back')
}

// 处理表单提交
const handleSubmit = () => {
  // 验证必填字段
  if (!editForm.first_choice) {
    alert('请选择第一志愿')
    return
  }
  
  if (!editForm.self_intro) {
    alert('请填写自我介绍')
    return
  }
  
  if (!editForm.skills) {
    alert('请填写技能')
    return
  }
  
  if (!editForm.projects) {
    alert('请填写项目经历')
    return
  }
  
  if (!editForm.awards) {
    alert('请填写获奖经历')
    return
  }
  
  // 如果选择更换正面照但未上传新照片
  if (editForm.real_head_img_change && !editForm.real_head_img) {
    alert('请上传新的正面照')
    return
  }
  
  emit('submit', editForm)
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
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('正面照只支持 JPG、PNG、GIF 格式的图片')
      return
    }
    
    editForm.real_head_img = file
    editForm.real_head_img_change = true // 自动勾选更换选项
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
    
    // 检查文件类型
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 PDF、DOC、DOCX 格式的文件')
      return
    }
    
    editForm.additional_file = file
    editForm.additional_file_change = true // 自动勾选更换选项
  }
}

// 处理正面照更换选项切换
const handleHeadImgChangeToggle = () => {
  if (!editForm.real_head_img_change) {
    editForm.real_head_img = null
  }
}

// 处理附加文件更换选项切换
const handleFileChangeToggle = () => {
  if (!editForm.additional_file_change) {
    editForm.additional_file = null
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

.file-upload-container {
  margin: 0.5rem 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.file-change-control {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: rgba(248, 180, 0, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(248, 180, 0, 0.2);
}

.file-change-control label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  font-weight: normal;
}

.file-change-control input[type="checkbox"] {
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
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
