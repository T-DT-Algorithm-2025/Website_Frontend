<template>
  <div class="my-submissions-container">
    <div class="form-header">
      <h2 class="section-title">
        我的投递 - {{ selectedRecruit?.name || '招聘批次' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回列表
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="userSubmissions.length === 0" class="no-submissions">
      <div class="empty-state">
        <span class="empty-icon">📄</span>
        <h3>暂无投递记录</h3>
        <p>您还没有向此招聘批次投递简历</p>
        <button
          v-if="selectedRecruit?.is_active && selectedRecruit?.available"
          class="action-btn apply-now-btn"
          @click="handleApplyNow"
        >
          立即投递
        </button>
      </div>
    </div>

    <div v-else class="submissions-list">
      <div
        v-for="submission in userSubmissions"
        :key="submission.submit_id"
        class="submission-card"
      >
        <div class="card-header">
          <div class="submission-info">
            <h3 class="submission-title">投递记录 #{{ submission.submit_id }}</h3>
            <div class="submission-meta">
              <span class="submission-time">
                投递时间：{{ formatDate(submission.submit_time) }}
              </span>
            </div>
          </div>
          <div class="submission-status-area">
            <span class="submission-status" :class="getSubmissionStatusClass(submission.status)">
              {{ submission.status_name }}
            </span>
          </div>
        </div>

        <div class="card-content">
          <div class="submission-details">
            <div class="detail-item">
              <strong>招聘批次：</strong>{{ selectedRecruit?.name || `批次 ${submission.recruit_id}` }}
            </div>
            <!-- <div class="detail-item">
              <strong>第一志愿：</strong>{{ submission.first_choice || '未填写' }}
            </div> -->
            <div class="detail-item">
              <strong>投递时间：</strong>{{ formatDate(submission.submit_time) }}
            </div>
          </div>

          <div class="card-actions">
            <!-- 根据简历状态显示不同的按钮 -->
            <!-- 简历通过(status=1): 显示预约面试按钮 -->
            <button
              v-if="submission.status === 1"
              class="action-btn interview-btn"
              @click="bookInterview(submission)"
            >
              📅 预约面试
            </button>
            <!-- 等待面试/已安排面试(status=2或包含"等待面试"/"已安排"): 显示面试信息按钮 -->
            <button
              v-else-if="isWaitingForInterview(submission)"
              class="action-btn interview-info-btn"
              @click="viewInterviewInfo(submission)"
            >
              📋 面试信息
            </button>
            <!-- 已录取状态(status=5): 显示加入培训按钮 -->
            <button
              v-else-if="submission.status === 5"
              class="action-btn join-training-btn"
              @click="showTrainingModal(submission)"
            >
              🎓 加入培训
            </button>
            <!-- 其他状态: 显示修改简历按钮 -->
            <button
              v-else
              class="action-btn edit-btn"
              @click="editSubmission(submission)"
            >
              修改简历
            </button>
            <button
              class="action-btn view-detail-btn"
              @click="viewSubmissionDetail(submission)"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加入培训弹窗 -->
    <div v-if="showTrainingModalFlag" class="modal-overlay" @click="closeTrainingModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4 class="modal-title">🎓 加入培训</h4>
          <button @click="closeTrainingModal" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="training-content">
            <div class="training-message">
              <h3>恭喜您已通过面试！</h3>
              <p class="message-text">请加入群聊</p>
            </div>
            
            <div class="qr-code-container">
              <img 
                :src="qqGroupImage" 
                alt="QQ群二维码" 
                class="qr-code-image"
                @error="handleImageError"
              />
              <p class="qr-code-caption">扫码加入QQ群</p>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeTrainingModal" class="action-btn close-modal-btn">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import confetti from 'canvas-confetti'
import qqGroupImage from '@/assets/images/qq_group.jpg'

const props = defineProps({
  userSubmissions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedRecruit: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['back', 'apply-now', 'view-submission-detail', 'edit-submission', 'book-interview', 'view-interview-info'])

// 培训弹窗相关状态
const showTrainingModalFlag = ref(false)
const currentSubmission = ref(null)

const handleBack = () => {
  emit('back')
}

const handleApplyNow = () => {
  emit('apply-now', props.selectedRecruit)
}

const viewSubmissionDetail = (submission) => {
  emit('view-submission-detail', submission)
}

const editSubmission = (submission) => {
  emit('edit-submission', submission)
}

const bookInterview = (submission) => {
  emit('book-interview', submission)
}

const viewInterviewInfo = (submission) => {
  emit('view-interview-info', submission)
}

// 显示培训弹窗
const showTrainingModal = (submission) => {
  currentSubmission.value = submission
  showTrainingModalFlag.value = true
  // 触发庆祝动画
  triggerCelebrationConfetti()
}

// 庆祝动画函数
const triggerCelebrationConfetti = () => {
  const end = Date.now() + 3 * 1000 // 3秒
  const colors = ['#8a2be2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726']

  function frame() {
    if (Date.now() > end) return

    // 左侧彩带炮
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    })

    // 右侧彩带炮
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    })

    requestAnimationFrame(frame) // 持续调用frame函数
  }

  frame()

  // 额外的庆祝效果：中央爆发
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    })
  }, 200)
}

// 关闭培训弹窗
const closeTrainingModal = () => {
  showTrainingModalFlag.value = false
  currentSubmission.value = null
}

// 处理图片加载错误
const handleImageError = (event) => {
  console.error('QQ群二维码图片加载失败')
  event.target.style.display = 'none'
}

// 判断是否为等待面试状态
const isWaitingForInterview = (submission) => {
  // 检查status值或status_name包含相关关键词
  if (submission.status === 2) return true
  if (submission.status_name) {
    const statusName = submission.status_name.toLowerCase()
    return statusName.includes('等待面试') || 
           statusName.includes('已安排') || 
           statusName.includes('待面试') ||
           statusName.includes('面试安排')
  }
  return false
}

// 获取投递状态样式类
const getSubmissionStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-pending' // 未处理
    case 1: return 'status-passed' // 简历通过
    case 2: return 'status-interview' // 等待面试/已安排面试
    case 3: return 'status-passed' // 面试通过
    case 4: return 'status-rejected' // 面试未通过
    case 5: return 'status-accepted' // 已录取
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
.my-submissions-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
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

.no-submissions {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: #ddd;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #999;
  line-height: 1.6;
}

.apply-now-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.apply-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  min-height: 0;
}

.submission-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
  flex-shrink: 0;
  min-height: 160px;
}

.submission-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  gap: 1rem;
}

.submission-info {
  flex: 1;
}

.submission-status-area {
  flex-shrink: 0;
}

.submission-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submission-time {
  font-size: 0.85rem;
  color: #666;
}

.submission-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.status-passed {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.status-rejected {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.submission-details {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.detail-item {
  font-size: 0.9rem;
  color: #666;
}

.detail-item strong {
  color: #333;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
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

.edit-btn {
  background: rgba(248, 180, 0, 0.1);
  color: #f8b400;
  border: 1px solid rgba(248, 180, 0, 0.3);
}

.edit-btn:hover:not(:disabled) {
  background: rgba(248, 180, 0, 0.2);
  transform: translateY(-1px);
}

.view-detail-btn {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.view-detail-btn:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.2);
  transform: translateY(-1px);
}

.interview-btn {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.interview-btn:hover:not(:disabled) {
  background: rgba(40, 167, 69, 0.2);
  transform: translateY(-1px);
}

.interview-info-btn {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.interview-info-btn:hover:not(:disabled) {
  background: rgba(23, 162, 184, 0.2);
  transform: translateY(-1px);
}

.join-training-btn {
  background: rgba(138, 43, 226, 0.1);
  color: #8a2be2;
  border: 1px solid rgba(138, 43, 226, 0.3);
}

.join-training-btn:hover:not(:disabled) {
  background: rgba(138, 43, 226, 0.2);
  transform: translateY(-1px);
}

.status-interview {
  background: rgba(23, 162, 184, 0.2);
  color: #0c5460;
  border: 1px solid rgba(23, 162, 184, 0.5);
}

.status-accepted {
  background: rgba(138, 43, 226, 0.2);
  color: #8a2be2;
  border: 1px solid rgba(138, 43, 226, 0.5);
}

/* 滚动条样式 */
.submissions-list::-webkit-scrollbar {
  width: 6px;
}

.submissions-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.submissions-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.submissions-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .submissions-list {
    overflow-y: auto;
  }
  
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .card-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .card-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .submission-card {
    margin: 0 -0.5rem;
    border-radius: 8px;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: row;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .submission-info {
    flex: 1;
  }
  
  .submission-status-area {
    flex-shrink: 0;
  }
  
  .submission-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .submission-details {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
  
  .no-submissions {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
}

/* 培训弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.modal-body {
  padding: 0 1.5rem 1.5rem;
}

.training-content {
  text-align: center;
}

.training-message {
  margin-bottom: 2rem;
}

.training-message h3 {
  color: #28a745;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.message-text {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-code-image {
  max-width: 200px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.qr-code-image:hover {
  transform: scale(1.05);
}

.qr-code-caption {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.modal-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.close-modal-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-modal-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-width: none;
    width: calc(100% - 2rem);
  }
  
  .modal-header {
    padding: 1rem 1rem 0;
    margin-bottom: 1rem;
  }
  
  .modal-body {
    padding: 0 1rem 1rem;
  }
  
  .modal-actions {
    padding: 0 1rem 1rem;
    padding-top: 1rem;
  }
  
  .qr-code-image {
    max-width: 180px;
  }
}
</style>
