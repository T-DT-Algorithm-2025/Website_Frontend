<template>
  <div class="interview-info-container">
    <div class="form-header">
      <h2 class="section-title">
        面试信息 - {{ selectedRecruit?.name || '招聘批次' }}
      </h2>
      <button class="back-btn" @click="handleBack">
        ← 返回投递列表
      </button>
    </div>



    <!-- 加载面试信息 -->
    <div v-if="loadingInterviewInfo" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载面试信息...</p>
    </div>

    <!-- 无面试信息 -->
    <div v-else-if="interviewInfo.length === 0" class="no-interview">
      <div class="alert-card warning">
        <div class="alert-icon">📅</div>
        <div class="alert-content">
          <h3>暂无面试安排</h3>
          <p>目前还没有为您安排面试时间，请耐心等待或联系管理员。</p>
        </div>
      </div>
    </div>

    <!-- 面试信息列表 -->
    <div v-else class="interview-list">
      <h3 class="section-subtitle">📋 我的面试安排</h3>
      
      <div class="interview-cards">
        <div
          v-for="interview in interviewInfo"
          :key="interview.interview_id"
          class="interview-card"
        >
          <div class="card-header">
            <div class="interview-title">
              <h4>{{ interview.choice || '面试' }}</h4>
              <span class="interview-id">ID: {{ interview.interview_id }}</span>
            </div>
            <div class="interview-status">
              <span class="status-tag active">已安排</span>
            </div>
          </div>
          
          <div class="card-content">
            <div class="interview-details">
              <div class="detail-row time-row">
                <div class="detail-icon">🕒</div>
                <div class="detail-content">
                  <div class="detail-label">面试时间</div>
                  <div class="detail-value time-value">{{ formatDateTime(interview.interview_time) }}</div>
                  <div class="detail-sub">{{ formatWeekday(interview.interview_time) }}</div>
                </div>
              </div>
              
              <div class="detail-row location-row">
                <div class="detail-icon">📍</div>
                <div class="detail-content">
                  <div class="detail-label">面试校区</div>
                  <div class="detail-value">{{ interview.room_name || '待确定' }}</div>
                </div>
              </div>
              
              <div class="detail-row choice-row">
                <div class="detail-icon">🎯</div>
                <div class="detail-content">
                  <div class="detail-label">面试地址</div>
                  <div class="detail-value">{{ interview.location || '未指定' }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="tips">
              <div class="tip-item">
                <span class="tip-icon">💡</span>
                <span>请提前15分钟到达面试地点</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="actions-section">
      <button
        @click="refreshInterviewInfo"
        class="btn-secondary refresh-btn"
        :disabled="loadingInterviewInfo"
      >
        <span v-if="loadingInterviewInfo" class="loading-spinner small"></span>
        {{ loadingInterviewInfo ? '刷新中...' : '🔄 刷新信息' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAlert } from '@/composables/useAlert'

const props = defineProps({
  selectedRecruit: {
    type: Object,
    required: true
  },
  selectedSubmission: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back'])

const { showAlert } = useAlert()

// 响应式数据
const loadingInterviewInfo = ref(true)
const interviewInfo = ref([])

// 获取面试信息
const fetchInterviewInfo = async () => {
  loadingInterviewInfo.value = true
  try {
    const response = await fetch(`/api/interview/my_bookings/${props.selectedRecruit.recruit_id}`)
    const result = await response.json()
    
    if (result.success) {
      // 过滤出与当前投递相关的面试信息
      const allInterviews = result.data || []
      interviewInfo.value = allInterviews.filter(interview => 
        interview.submit_id === props.selectedSubmission.submit_id
      )
    } else {
      throw new Error(result.error || '获取面试信息失败')
    }
  } catch (error) {
    console.error('获取面试信息失败:', error)
    showAlert('获取面试信息失败: ' + error.message, 'error')
    interviewInfo.value = []
  } finally {
    loadingInterviewInfo.value = false
  }
}

// 刷新面试信息
const refreshInterviewInfo = async () => {
  await fetchInterviewInfo()
  showAlert('面试信息已刷新', 'success')
}

// 返回
const handleBack = () => {
  emit('back')
}

// 获取状态显示名称
const getStatusDisplayName = (statusName) => {
  if (!statusName) return '等待面试'
  
  if (statusName.includes('等待') || statusName.includes('待')) {
    return '等待面试'
  } else if (statusName.includes('安排') || statusName.includes('已安排')) {
    return '已安排面试'
  } else {
    return statusName
  }
}

// 格式化日期时间
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

// 格式化星期
const formatWeekday = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      weekday: 'long'
    }).format(new Date(dateTimeStr))
  } catch (error) {
    return ''
  }
}

// 组件挂载时获取面试信息
onMounted(() => {
  fetchInterviewInfo()
})
</script>

<style scoped>
.interview-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
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

.submission-info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border-left: 4px solid #17a2b8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-interview {
  background: rgba(23, 162, 184, 0.2);
  color: #0c5460;
  border: 1px solid rgba(23, 162, 184, 0.5);
}

.card-body {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  font-size: 0.9rem;
  color: #666;
}

.info-item strong {
  color: #333;
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
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #17a2b8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
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

.alert-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.alert-card.warning {
  border-left: 4px solid #ffc107;
  background: #fff8e1;
}

.alert-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.alert-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.alert-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.interview-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.section-subtitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #17a2b8;
}

.interview-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.interview-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-left: 5px solid #17a2b8;
  transition: all 0.3s ease;
}

.interview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.interview-card .card-header {
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
  border-bottom: 2px solid #b3e5fc;
}

.interview-title {
  flex: 1;
}

.interview-title h4 {
  margin: 0 0 0.25rem 0;
  color: #0277bd;
  font-size: 1.3rem;
  font-weight: 600;
}

.interview-id {
  font-size: 0.8rem;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.interview-status {
  flex-shrink: 0;
}

.status-tag {
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-tag.active {
  background: #4caf50;
  color: white;
}

.card-content {
  padding: 2rem;
}

.interview-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.detail-row:hover {
  background: #e9ecef;
}

.detail-icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.detail-content {
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
  word-break: break-all;
}

.time-value {
  font-size: 1.1rem;
  color: #0277bd;
}

.detail-sub {
  font-size: 0.8rem;
  color: #17a2b8;
  margin-top: 0.25rem;
}

.card-footer {
  background: #f1f8e9;
  padding: 1.5rem;
  border-top: 1px solid #c8e6c9;
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #2e7d32;
}

.tip-icon {
  font-size: 1rem;
}

.actions-section {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #dee2e6;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .section-title {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .interview-card .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .interview-status {
    text-align: center;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }
  
  .detail-content {
    text-align: center;
  }
  
  .tips {
    align-items: center;
  }
  
  .tip-item {
    justify-content: center;
    text-align: center;
  }
  
  .alert-card {
    flex-direction: column;
    text-align: center;
  }
}

/* 滚动条样式 */
.interview-list::-webkit-scrollbar {
  width: 6px;
}

.interview-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.interview-list::-webkit-scrollbar-thumb {
  background: rgba(23, 162, 184, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.interview-list::-webkit-scrollbar-thumb:hover {
  background: rgba(23, 162, 184, 0.5);
}
</style>
