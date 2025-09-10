<template>
  <div class="user-recruit-detail-container">
    <div class="detail-header">
      <h3>招聘详情</h3>
      <button class="close-btn" @click="handleClose" type="button">
        <span>✕</span>
      </button>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="recruitDetail" class="recruit-detail">
      <!-- 投递提示 -->
      <div v-if="recruitDetail.available && !recruitDetail.is_applyed" class="detail-section">
        <div class="apply-notice">
          <div class="notice-icon">💡</div>
          <div class="notice-content">
            <h5>投递提示</h5>
            <p>该招聘批次正在接受投递，请点击下方"立即投递"按钮提交您的申请。</p>
          </div>
        </div>
      </div>

      <!-- 已投递提示 -->
      <div v-else-if="recruitDetail.is_applyed" class="detail-section">
        <div class="applied-notice">
          <div class="notice-icon">✅</div>
          <div class="notice-content">
            <h5>已投递</h5>
            <p>您已成功投递该招聘批次，请耐心等待审核结果。您可以在"我的投递"中查看投递状态。</p>
          </div>
        </div>
      </div>

      <!-- 招聘结束提示 -->
      <div v-else-if="!recruitDetail.available && recruitDetail.is_active" class="detail-section">
        <div class="ended-notice">
          <div class="notice-icon">⏰</div>
          <div class="notice-content">
            <h5>招聘已结束</h5>
            <p>该招聘批次已过投递截止时间，暂时无法投递。</p>
          </div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="detail-section">
        <h4 class="section-title">招聘信息</h4>
        <div class="detail-group">
          <div class="detail-value highlight">{{ recruitDetail.name }}</div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="detail-section">
        <h4 class="section-title">时间安排</h4>
        <div class="detail-row">
          <div class="detail-group">
            <label class="detail-label">开始时间</label>
            <div class="detail-value">
              <span class="time-value">{{ formatDate(recruitDetail.start_time) }}</span>
            </div>
          </div>
          <div class="detail-group">
            <label class="detail-label">结束时间</label>
            <div class="detail-value">
              <span class="time-value">{{ formatDate(recruitDetail.end_time) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态信息 -->
      <!-- <div class="detail-section">
        <h4 class="section-title">投递状态</h4>
        <div class="detail-group">
          <div class="status-display">
            <span class="status-badge" :class="getRecruitStatusClass(recruitDetail)">
              {{ getRecruitStatusText(recruitDetail) }}
            </span>
            <span v-if="recruitDetail.is_applyed" class="applied-badge">
              您已投递
            </span>
          </div>
        </div>
      </div> -->

      <!-- 招聘描述 -->
      <div class="detail-section">
        <h4 class="section-title">详细说明</h4>
        <div class="detail-group">
          <div class="detail-description">
            {{ recruitDetail.description || '暂无详细说明' }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="error-state">
      <p>加载招聘详情失败</p>
    </div>

    <!-- 操作按钮 -->
    <div class="detail-actions">
      <button class="action-btn secondary-btn" @click="handleClose">
        关闭
      </button>
      <button 
        v-if="recruitDetail && recruitDetail.available && !recruitDetail.is_applyed"
        class="action-btn primary-btn" 
        @click="handleApply"
      >
        立即投递
      </button>
      <button 
        v-else-if="recruitDetail && recruitDetail.is_applyed"
        class="action-btn info-btn" 
        @click="handleViewSubmissions"
      >
        查看我的投递
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  recruitData: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'apply', 'view-submissions'])

const recruitDetail = ref(null)

// 监听招聘数据变化
watch(() => props.recruitData, (newData) => {
  recruitDetail.value = newData
}, { immediate: true })

// 关闭详情页
const handleClose = () => {
  emit('close')
}

// 立即投递
const handleApply = () => {
  emit('apply', recruitDetail.value)
}

// 查看我的投递
const handleViewSubmissions = () => {
  emit('view-submissions', recruitDetail.value)
}

// 获取招聘状态显示文本
const getRecruitStatusText = (recruit) => {
  if (!recruit.is_active) {
    return '未发布'
  } else if (recruit.available) {
    return '可投递'
  } else {
    return '已结束'
  }
}

// 获取招聘状态样式类
const getRecruitStatusClass = (recruit) => {
  if (!recruit.is_active) {
    return 'status-inactive'
  } else if (recruit.available) {
    return 'status-available'
  } else {
    return 'status-ended'
  }
}

// 格式化日期
const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  }).format(new Date(date))
}
</script>

<style scoped>
.user-recruit-detail-container {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8b400 0%, #f39c12 100%);
  color: white;
  flex-shrink: 0;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
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

.error-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #dc3545;
}

.recruit-detail {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 0;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8b400;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.detail-value.highlight {
  background: linear-gradient(135deg, rgba(248, 180, 0, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%);
  border-color: rgba(248, 180, 0, 0.3);
  font-weight: 600;
  color: #f8b400;
}

.time-value {
  font-weight: 500;
}

.detail-description {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  line-height: 1.6;
  min-height: 80px;
  white-space: pre-wrap;
  color: #333;
}

.status-display {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-inactive {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  border: 1px solid rgba(108, 117, 125, 0.5);
}

.status-available {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
}

.status-ended {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.applied-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #28a745;
  font-weight: 500;
}

/* 通知样式 */
.apply-notice, .applied-notice, .ended-notice {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.apply-notice {
  background: rgba(40, 167, 69, 0.1);
  border-left-color: #28a745;
}

.applied-notice {
  background: rgba(23, 162, 184, 0.1);
  border-left-color: #17a2b8;
}

.ended-notice {
  background: rgba(108, 117, 125, 0.1);
  border-left-color: #6c757d;
}

.notice-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notice-content h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.notice-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
  font-size: 0.9rem;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  flex-shrink: 0;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.secondary-btn {
  background: #6c757d;
  color: white;
}

.secondary-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.primary-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.info-btn {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}

.info-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

/* 滚动条样式 */
.recruit-detail::-webkit-scrollbar {
  width: 6px;
}

.recruit-detail::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.recruit-detail::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.recruit-detail::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-header {
    padding: 1rem 1.5rem;
  }
  
  .recruit-detail {
    padding: 1.5rem;
  }
  
  .detail-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-actions {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .status-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
