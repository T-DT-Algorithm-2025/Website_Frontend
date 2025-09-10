<template>
  <div class="content-section">
    <div class="form-header">
      <h2 class="section-title">
        投递详情 - #{{ selectedSubmission?.submit_id || '' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回投递列表
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="submissionDetail" class="submission-detail">
      <!-- 投递基本信息 -->
      <div class="detail-section">
        <h3 class="section-subtitle">投递信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>投递ID</label>
            <span>{{ submissionDetail.submission.submit_id }}</span>
          </div>
          <div class="info-item">
            <label>招聘批次</label>
            <span>{{ selectedRecruit?.name || '未知' }}</span>
          </div>
          <div class="info-item">
            <label>投递时间</label>
            <span>{{ formatDate(submissionDetail.submission.submit_time) }}</span>
          </div>
          <div class="info-item">
            <label>审核状态</label>
            <span :class="getSubmissionStatusClass(submissionDetail.submission.status)">
              {{ submissionDetail.submission.status_name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 志愿选择 -->
      <div class="detail-section">
        <h3 class="section-subtitle">志愿选择</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>第一志愿</label>
            <span>{{ submissionDetail.info.first_choice }}</span>
          </div>
          <div class="info-item">
            <label>第二志愿</label>
            <span>{{ submissionDetail.info.second_choice || '无' }}</span>
          </div>
        </div>
      </div>

      <!-- 自我介绍 -->
      <div class="detail-section">
        <h3 class="section-subtitle">自我介绍</h3>
        <div class="content-block">
          {{ submissionDetail.info.self_intro }}
        </div>
      </div>

      <!-- 技能 -->
      <div class="detail-section">
        <h3 class="section-subtitle">技能描述</h3>
        <div class="content-block">
          {{ submissionDetail.info.skills }}
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="detail-section">
        <h3 class="section-subtitle">项目经历</h3>
        <div class="content-block">
          {{ submissionDetail.info.projects }}
        </div>
      </div>

      <!-- 获奖经历 -->
      <div class="detail-section">
        <h3 class="section-subtitle">获奖经历</h3>
        <div class="content-block">
          {{ submissionDetail.info.awards }}
        </div>
      </div>

      <!-- 学业信息 -->
      <div class="detail-section">
        <h3 class="section-subtitle">学业信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>绩点</label>
            <span>{{ submissionDetail.info.grade_point || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>成绩排名</label>
            <span>{{ submissionDetail.info.grade_rank || '未填写' }}</span>
          </div>
        </div>
      </div>

      <!-- 正面照 -->
      <div class="detail-section">
        <h3 class="section-subtitle">正面照</h3>
        <div class="photo-section">
          <div v-if="loadingPhoto" class="photo-loading">
            <div class="loading-spinner"></div>
            <p>加载照片中...</p>
          </div>
          <div v-else-if="photoError" class="photo-error">
            <span class="error-icon">❌</span>
            <p>{{ photoError }}</p>
            <button class="action-btn retry-btn" @click="loadHeadImg">
              重新加载
            </button>
          </div>
          <div v-else-if="headImgUrl" class="photo-container">
            <img :src="headImgUrl" alt="正面照" class="head-img" @error="handleImageError" />
            <div class="photo-actions">
              <button class="action-btn view-full-btn" @click="viewFullImage">
                查看大图
              </button>
            </div>
          </div>
          <div v-else class="photo-placeholder">
            <span class="placeholder-icon">📷</span>
            <p>暂无正面照</p>
          </div>
        </div>
      </div>

      <!-- 附加文件 -->
      <div class="detail-section">
        <h3 class="section-subtitle">附加文件</h3>
        <div class="file-section">
          <div v-if="submissionDetail.info.additional_file_path" class="file-container">
            <div class="file-info">
              <span class="file-icon">📄</span>
              <div class="file-details">
                <p class="file-name">附加文件</p>
                <p class="file-description">点击下载查看完整文件</p>
              </div>
            </div>
            <button
              class="action-btn download-btn"
              @click="handleDownload"
              :disabled="downloadingFile"
            >
              {{ downloadingFile ? '下载中...' : '📥 下载文件' }}
            </button>
          </div>
          <div v-else class="file-placeholder">
            <span class="placeholder-icon">📄</span>
            <p>未上传附加文件</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { authAPI } from '@/api/auth.js'

const props = defineProps({
  submissionDetail: {
    type: Object,
    default: () => null
  },
  selectedSubmission: {
    type: Object,
    default: () => null
  },
  selectedRecruit: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  },
  downloadingFile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'download'])

// 正面照相关状态
const headImgUrl = ref(null)
const loadingPhoto = ref(false)
const photoError = ref(null)

const handleBack = () => {
  emit('back')
}

const handleDownload = () => {
  emit('download', props.selectedSubmission.submit_id)
}

// 加载正面照
const loadHeadImg = async () => {
  if (!props.selectedSubmission?.submit_id) return
  
  loadingPhoto.value = true
  photoError.value = null
  
  try {
    const result = await authAPI.getResumeHeadImg(props.selectedSubmission.submit_id)
    if (result.success) {
      // 如果之前有图片URL，释放它
      if (headImgUrl.value) {
        URL.revokeObjectURL(headImgUrl.value)
      }
      headImgUrl.value = result.imageUrl
    } else {
      photoError.value = result.error || '加载正面照失败'
    }
  } catch (error) {
    console.error('加载正面照失败:', error)
    photoError.value = '网络错误，请稍后重试'
  } finally {
    loadingPhoto.value = false
  }
}

// 处理图片加载错误
const handleImageError = () => {
  photoError.value = '图片加载失败'
  if (headImgUrl.value) {
    URL.revokeObjectURL(headImgUrl.value)
    headImgUrl.value = null
  }
}

// 查看大图
const viewFullImage = () => {
  if (headImgUrl.value) {
    window.open(headImgUrl.value, '_blank')
  }
}

// 监听投递详情变化，自动加载正面照
watch(() => props.selectedSubmission, (newSubmission) => {
  if (newSubmission?.submit_id) {
    loadHeadImg()
  }
}, { immediate: true })

// 组件销毁时释放图片URL
onUnmounted(() => {
  if (headImgUrl.value) {
    URL.revokeObjectURL(headImgUrl.value)
  }
})

// 获取投递状态样式类
const getSubmissionStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-pending' // 未处理
    case 1: return 'status-passed' // 通过
    case 2: return 'status-rejected' // 拒绝
    default: return 'status-pending'
  }
}

// 格式化日期
const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
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

.submission-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  color: #333;
  font-size: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #f8b400;
}

.content-block {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
}

/* 正面照相关样式 */
.photo-section {
  margin-top: 1rem;
}

.photo-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.photo-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
  text-align: center;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.photo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.head-img {
  max-width: 300px;
  max-height: 400px;
  width: auto;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #f8b400;
}

.head-img:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.photo-actions {
  display: flex;
  gap: 0.5rem;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #ddd;
}

/* 文件相关样式 */
.file-section {
  margin-top: 1rem;
}

.file-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.file-icon {
  font-size: 2rem;
  color: #3498db;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.file-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.file-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
  background: white;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.download-btn {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.download-btn:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.2);
  transform: translateY(-1px);
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.view-full-btn {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.view-full-btn:hover:not(:disabled) {
  background: rgba(248, 180, 0, 0.2);
  transform: translateY(-1px);
}

.retry-btn {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  margin-top: 0.5rem;
}

.retry-btn:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.2);
  transform: translateY(-1px);
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.status-passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.status-rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

/* 滚动条样式 */
.submission-detail::-webkit-scrollbar {
  width: 6px;
}

.submission-detail::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.submission-detail::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.submission-detail::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .submission-detail {
    overflow-y: visible;
  }
  
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .head-img {
    max-width: 250px;
    max-height: 300px;
  }
  
  .file-container {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .photo-actions {
    justify-content: center;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>

