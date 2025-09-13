<template>
  <div class="resume-detail-container">
    <!-- 详情头部 -->
    <div class="detail-header">
      <h2 class="detail-title">简历详情</h2>
      <button class="close-btn" @click="handleClose">
        <span>✕</span>
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 详情内容 -->
    <div v-else-if="resumeData" class="detail-content">
      
      <!-- 基本信息 -->
      <div class="info-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>简历ID:</label>
            <span>{{ resumeData.submission?.submit_id }}</span>
          </div>
          <div class="info-item">
            <label>用户UID:</label>
            <span>{{ resumeData.submission?.uid }}</span>
          </div>
          <div class="info-item">
            <label>招聘批次:</label>
            <span>{{ resumeData.submission?.recruit_id }}</span>
          </div>
          <div class="info-item">
            <label>提交时间:</label>
            <span>{{ formatDate(resumeData.submission?.submit_time) }}</span>
          </div>
          <div class="info-item">
            <label>当前状态:</label>
            <span class="status-badge" :class="getStatusClass(resumeData.submission?.status)">
              {{ getStatusName(resumeData.submission?.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 用户个人信息 -->
      <div class="info-section">
        <h3 class="section-title">
          用户个人信息
          <span v-if="isLoadingUserInfo" class="loading-text">加载中...</span>
        </h3>
        <div v-if="userInfo" class="info-grid">
          <div class="info-item">
            <label>真实姓名:</label>
            <span>{{ userInfo.realname || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>性别:</label>
            <span>{{ userInfo.gender || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>学号:</label>
            <span>{{ userInfo.student_id || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>院系:</label>
            <span>{{ userInfo.department || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>专业:</label>
            <span>{{ userInfo.major || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>年级:</label>
            <span>{{ userInfo.grade || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>学历:</label>
            <span>{{ userInfo.rank || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>联系电话:</label>
            <span>{{ userInfo.phone_number || '未填写' }}</span>
          </div>
        </div>
        <div v-else-if="!isLoadingUserInfo" class="no-user-info">
          <span class="error-text">无法获取用户信息</span>
        </div>
      </div>

      <!-- 状态管理 -->
      <div class="status-section">
        <h3 class="section-title">状态管理</h3>
        <div class="status-controls">
          <select v-model="newStatus" class="status-select">
            <option value="">选择新状态</option>
            <option v-for="status in statusNames" :key="status.status_id" :value="status.status_id">
              {{ status.status_name }}
            </option>
          </select>
          <button 
            class="update-status-btn" 
            @click="updateStatus" 
            :disabled="!newStatus || isUpdatingStatus"
          >
            {{ isUpdatingStatus ? '更新中...' : '更新状态' }}
          </button>
        </div>
      </div>

      <!-- 志愿信息 -->
      <div class="info-section">
        <h3 class="section-title">志愿信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>第一志愿:</label>
            <span>{{ resumeData.info?.first_choice }}</span>
          </div>
          <div class="info-item">
            <label>第二志愿:</label>
            <span>{{ resumeData.info?.second_choice || '无' }}</span>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="info-section">
        <h3 class="section-title">详细信息</h3>
        
        <div class="info-item full-width">
          <label>自我介绍:</label>
          <div class="text-content">{{ resumeData.info?.self_intro }}</div>
        </div>
        
        <div class="info-item full-width">
          <label>技能:</label>
          <div class="text-content">{{ resumeData.info?.skills }}</div>
        </div>
        
        <div class="info-item full-width">
          <label>项目经历:</label>
          <div class="text-content">{{ resumeData.info?.projects }}</div>
        </div>
        
        <div class="info-item full-width">
          <label>获奖经历:</label>
          <div class="text-content">{{ resumeData.info?.awards }}</div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>绩点:</label>
            <span>{{ resumeData.info?.grade_point || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>排名:</label>
            <span>{{ resumeData.info?.grade_rank || '未填写' }}</span>
          </div>
        </div>
      </div>

      <!-- 附件信息 -->
      <div class="info-section">
        <h3 class="section-title">附件信息</h3>
        <div class="attachment-controls">
          <div class="attachment-item">
            <label>正面照:</label>
            <button class="view-attachment-btn" @click="viewHeadImg">查看正面照</button>
          </div>
          <div v-if="resumeData.info?.additional_file_path" class="attachment-item">
            <label>附加文件:</label>
            <button 
              class="download-attachment-btn" 
              @click="downloadAttachment"
              :disabled="isDownloading"
            >
              {{ isDownloading ? '下载中...' : '下载附加文件' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 评审记录 -->
      <div class="review-section">
        <h3 class="section-title">评审记录</h3>
        
        <!-- 添加评审 -->
        <div class="add-review-form">
          <h4>添加评审意见</h4>
          <div class="review-form-grid">
            <div class="form-group">
              <label>评分 (1-100):</label>
              <input 
                type="number" 
                v-model="newReview.score" 
                min="1" 
                max="100" 
                class="score-input"
              />
            </div>
            <div class="form-group">
              <label>是否通过:</label>
              <select v-model="newReview.passed" class="passed-select">
                <option :value="true">通过</option>
                <option :value="false">不通过</option>
              </select>
            </div>
          </div>
          <div class="form-group full-width">
            <label>评审意见:</label>
            <textarea 
              v-model="newReview.comments" 
              rows="3" 
              placeholder="请输入评审意见..."
              class="comments-textarea"
            ></textarea>
          </div>
          <button 
            class="add-review-btn" 
            @click="addReview"
            :disabled="!canAddReview || isAddingReview"
          >
            {{ isAddingReview ? '提交中...' : '提交评审' }}
          </button>
        </div>

        <!-- 评审记录列表 -->
        <div v-if="reviews.length > 0" class="reviews-list">
          <h4>历史评审记录</h4>
          <div 
            v-for="review in reviews" 
            :key="review.review_id"
            class="review-item"
          >
            <div class="review-header">
              <div class="review-meta">
                <span class="review-score">评分: {{ review.score }}</span>
                <span class="review-result" :class="{ passed: review.passed, rejected: !review.passed }">
                  {{ review.passed ? '通过' : '不通过' }}
                </span>
                <span class="review-time">{{ formatDate(review.created_time) }}</span>
              </div>
              <button 
                class="delete-review-btn" 
                @click="deleteReview(review.review_id)"
                :disabled="isDeletingReview"
              >
                删除
              </button>
            </div>
            <div class="review-content">
              {{ review.comments }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 正面照查看器 -->
    <div v-if="showHeadImg" class="image-viewer-overlay" @click="closeHeadImg">
      <div class="image-viewer-content" @click.stop>
        <div class="image-viewer-header">
          <h3>正面照</h3>
          <button class="close-btn" @click="closeHeadImg">✕</button>
        </div>
        <div class="image-container">
          <img v-if="headImgUrl" :src="headImgUrl" alt="正面照" class="head-img" />
          <div v-else class="loading-image">加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { authAPI } from '@/api/auth.js'

import { useAlert } from '@/composables/useAlert'
const { showAlert } = useAlert()

const props = defineProps({
  resumeData: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  },
  statusNames: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'status-updated', 'add-review'])

// 状态管理
const newStatus = ref('')
const isUpdatingStatus = ref(false)

// 用户信息相关
const userInfo = ref(null)
const isLoadingUserInfo = ref(false)

// 评审相关
const reviews = ref([])
const newReview = ref({
  score: 80,
  passed: true,
  comments: ''
})
const isAddingReview = ref(false)
const isDeletingReview = ref(false)

// 附件相关
const isDownloading = ref(false)
const showHeadImg = ref(false)
const headImgUrl = ref('')

// 是否可以添加评审
const canAddReview = computed(() => {
  return newReview.value.score >= 1 && 
         newReview.value.score <= 100 && 
         newReview.value.comments.trim().length > 0
})

// 关闭详情页面
const handleClose = () => {
  emit('close')
}

// 获取状态显示名称
const getStatusName = (statusId) => {
  const status = props.statusNames.find(s => s.status_id === statusId)
  return status ? status.status_name : '未知状态'
}

// 获取状态样式类
const getStatusClass = (statusId) => {
  const statusName = getStatusName(statusId).toLowerCase()
  if (statusName.includes('未处理') || statusName.includes('待')) {
    return 'status-pending'
  } else if (statusName.includes('通过') || statusName.includes('成功')) {
    return 'status-approved'
  } else if (statusName.includes('拒绝') || statusName.includes('淘汰')) {
    return 'status-rejected'
  } else {
    return 'status-default'
  }
}

// 更新状态
const updateStatus = async () => {
  if (!newStatus.value || !props.resumeData?.submission?.submit_id) return
  
  isUpdatingStatus.value = true
  try {
    const result = await authAPI.batchUpdateResumeStatus(
      [props.resumeData.submission.submit_id], 
      parseInt(newStatus.value)
    )
    
    if (result.success) {
      showAlert('状态更新成功', 'success')
      // 更新本地数据
      if (props.resumeData.submission) {
        props.resumeData.submission.status = parseInt(newStatus.value)
      }
      emit('status-updated')
      newStatus.value = ''
    } else {
      showAlert('状态更新失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('更新状态时出错:', error)
    showAlert('状态更新失败，请稍后重试', 'error')
  } finally {
    isUpdatingStatus.value = false
  }
}

// 添加评审意见
const addReview = async () => {
  if (!canAddReview.value || !props.resumeData?.submission?.submit_id) return
  
  isAddingReview.value = true
  try {
    const result = await authAPI.addResumeReview(
      props.resumeData.submission.submit_id,
      {
        score: newReview.value.score,
        passed: newReview.value.passed,
        comments: newReview.value.comments
      }
    )
    
    if (result.success) {
      showAlert('评审提交成功', 'success')
      // 重新获取评审记录
      await fetchReviews()
      // 重置表单
      newReview.value = {
        score: 80,
        passed: true,
        comments: ''
      }
      emit('add-review')
    } else {
      showAlert('评审提交失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('添加评审时出错:', error)
    showAlert('评审提交失败，请稍后重试', 'error')
  } finally {
    isAddingReview.value = false
  }
}

// 删除评审
const deleteReview = async (reviewId) => {
  isDeletingReview.value = true
  try {
    const result = await authAPI.deleteResumeReview(reviewId)
    
    if (result.success) {
      showAlert('评审删除成功', 'success')
      // 重新获取评审记录
      await fetchReviews()
    } else {
      showAlert('评审删除失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('删除评审时出错:', error)
    showAlert('评审删除失败，请稍后重试', 'error')
  } finally {
    isDeletingReview.value = false
  }
}

// 获取用户个人信息
const fetchUserInfo = async () => {
  if (!props.resumeData?.submission?.uid) {
    console.log('缺少用户UID，无法获取用户信息')
    return
  }
  
  console.log('开始获取用户信息，UID:', props.resumeData.submission.uid)
  isLoadingUserInfo.value = true
  try {
    const result = await authAPI.getAdminUserInfo(props.resumeData.submission.uid)
    console.log('用户信息API响应:', result)
    if (result.success) {
      userInfo.value = result.data
      console.log('用户信息获取成功:', result.data)
    } else {
      console.error('获取用户信息失败:', result.error)
      userInfo.value = null
    }
  } catch (error) {
    console.error('获取用户信息时出错:', error)
    userInfo.value = null
  } finally {
    isLoadingUserInfo.value = false
  }
}

// 获取评审记录
const fetchReviews = async () => {
  if (!props.resumeData?.submission?.submit_id) return
  
  try {
    const result = await authAPI.getResumeReviews(props.resumeData.submission.submit_id)
    if (result.success) {
      reviews.value = result.data || []
    } else {
      console.error('获取评审记录失败:', result.error)
    }
  } catch (error) {
    console.error('获取评审记录时出错:', error)
  }
}

// 查看正面照
const viewHeadImg = async () => {
  if (!props.resumeData?.submission?.submit_id) return
  
  try {
    const result = await authAPI.getResumeHeadImg(props.resumeData.submission.submit_id)
    if (result.success) {
      headImgUrl.value = result.imageUrl
      showHeadImg.value = true
    } else {
      showAlert('获取正面照失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('获取正面照时出错:', error)
    showAlert('获取正面照失败，请稍后重试', 'error')
  }
}

// 关闭正面照查看器
const closeHeadImg = () => {
  showHeadImg.value = false
  if (headImgUrl.value) {
    URL.revokeObjectURL(headImgUrl.value)
    headImgUrl.value = ''
  }
}

// 下载附加文件
const downloadAttachment = async () => {
  if (!props.resumeData?.submission?.submit_id) return
  
  isDownloading.value = true
  try {
    const result = await authAPI.downloadAttachment(props.resumeData.submission.submit_id)
    if (result.success) {
      // 创建下载链接
      const url = window.URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      // 尝试从文件路径获取文件名
      let fileName = `attachment_${props.resumeData.submission.submit_id}.pdf`
      if (props.resumeData.info?.additional_file_path) {
        const pathParts = props.resumeData.info.additional_file_path.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      }
      
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      showAlert('下载文件失败: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('下载文件时出错:', error)
    showAlert('下载文件失败，请稍后重试', 'error')
  } finally {
    isDownloading.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未知时间'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// 监听简历数据变化
watch(() => props.resumeData, (newData) => {
  if (newData?.submission) {
    console.log('简历数据已加载:', newData)
    if (newData.submission.submit_id) {
      fetchReviews()
    }
    if (newData.submission.uid) {
      fetchUserInfo()
    }
  }
}, { immediate: true })

// 组件挂载时获取数据
onMounted(() => {
  console.log('ResumeDetail组件挂载，当前props.resumeData:', props.resumeData)
  if (props.resumeData?.submission) {
    if (props.resumeData.submission.submit_id) {
      fetchReviews()
    }
    if (props.resumeData.submission.uid) {
      fetchUserInfo()
    }
  }
})
</script>

<style scoped>
.resume-detail-container {
  width: 800px;
  max-width: 95vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #666;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f8b400;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #f8b400;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.info-item span, .text-content {
  color: #666;
  line-height: 1.6;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.text-content {
  white-space: pre-wrap;
  min-height: 60px;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
  width: fit-content;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.status-approved {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.status-rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.status-default {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  border: 1px solid rgba(108, 117, 125, 0.5);
}

.loading-text {
  font-size: 0.8rem;
  color: #666;
  font-weight: normal;
  margin-left: 0.5rem;
}

.verification-badge, .permission-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.verification-badge {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  border: 1px solid rgba(108, 117, 125, 0.5);
}

.verification-badge.verified {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.permission-badge {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  border: 1px solid rgba(108, 117, 125, 0.5);
}

.permission-badge.admin {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.no-user-info {
  padding: 2rem;
  text-align: center;
}

.error-text {
  color: #dc3545;
  font-style: italic;
}

.status-section {
  background: #e7f3ff;
  border-radius: 8px;
  padding: 1.5rem;
}

.status-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 150px;
}

.update-status-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.update-status-btn:hover:not(:disabled) {
  background: #0056b3;
}

.update-status-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.attachment-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.attachment-item label {
  font-weight: 600;
  color: #555;
  min-width: 80px;
}

.view-attachment-btn, .download-attachment-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.view-attachment-btn:hover, .download-attachment-btn:hover {
  background: #138496;
}

.download-attachment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.review-section {
  background: #fff8e1;
  border-radius: 8px;
  padding: 1.5rem;
}

.add-review-form {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
}

.add-review-form h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.review-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.score-input, .passed-select, .comments-textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.comments-textarea {
  resize: vertical;
  min-height: 80px;
}

.add-review-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.3s ease;
}

.add-review-btn:hover:not(:disabled) {
  background: #218838;
}

.add-review-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reviews-list h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.review-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.review-score {
  font-weight: 600;
  color: #333;
}

.review-result {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.review-result.passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
}

.review-result.rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
}

.review-time {
  color: #666;
  font-size: 0.8rem;
}

.delete-review-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s ease;
}

.delete-review-btn:hover:not(:disabled) {
  background: #c82333;
}

.delete-review-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.review-content {
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 图片查看器样式 */
.image-viewer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.image-viewer-content {
  background: white;
  border-radius: 12px;
  max-width: 80%;
  max-height: 85%;
  width: fit-content;
  min-width: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: imageViewerEnter 0.3s ease-out;
}

@keyframes imageViewerEnter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.image-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px 12px 0 0;
}

.image-viewer-header h3 {
  margin: 0;
  color: #333;
}

.image-container {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  max-height: 450px;
  background: #f8f9fa;
}

.head-img {
  max-width: 100%;
  max-height: 400px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.head-img:hover {
  transform: scale(1.02);
}

.loading-image {
  color: #666;
  font-size: 1.1rem;
}

/* 滚动条样式 */
.detail-content::-webkit-scrollbar {
  width: 6px;
}

.detail-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.detail-content::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-detail-container {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .review-form-grid {
    grid-template-columns: 1fr;
  }
  
  .status-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .attachment-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .review-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .review-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  /* 移动端图片查看器优化 */
  .image-viewer-content {
    max-width: 95%;
    max-height: 90%;
    min-width: 280px;
  }
  
  .image-container {
    padding: 1rem;
    max-height: 350px;
  }
  
  .head-img {
    max-height: 300px;
  }
  
  .image-viewer-header {
    padding: 0.75rem 1rem;
  }
}
</style>
