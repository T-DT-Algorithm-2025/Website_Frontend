<template>
  <div class="recruit-detail-container">
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
      <!-- 基本信息 -->
      <div class="detail-section">
        <h4 class="section-title">基本信息</h4>
        <div class="detail-row">
          <div class="detail-group">
            <label class="detail-label">招聘名称</label>
            <div class="detail-value">{{ recruitDetail.name }}</div>
          </div>
          <div class="detail-group">
            <label class="detail-label">批次ID</label>
            <div class="detail-value code">{{ recruitDetail.recruit_id }}</div>
          </div>
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
      <div class="detail-section">
        <h4 class="section-title">状态信息</h4>
        <div class="detail-row">
          <div class="detail-group">
            <label class="detail-label">发布状态</label>
            <div class="detail-value">
              <span class="status-badge" :class="{ 'status-active': recruitDetail.is_active, 'status-inactive': !recruitDetail.is_active }">
                {{ recruitDetail.is_active ? '已发布' : '未发布' }}
              </span>
            </div>
          </div>
          <div class="detail-group">
            <label class="detail-label">投递状态</label>
            <div class="detail-value">
              <span class="status-badge" :class="getRecruitStatusClass(recruitDetail)">
                {{ getRecruitStatusText(recruitDetail) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 招聘描述 -->
      <div class="detail-section">
        <h4 class="section-title">招聘描述</h4>
        <div class="detail-group full-width">
          <div class="detail-description">
            {{ recruitDetail.description || '暂无描述' }}
          </div>
        </div>
      </div>

      <!-- 统计信息 (如果有的话) -->
      <div class="detail-section">
        <h4 class="section-title">招聘统计</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">已投递人数</div>
            <div class="stat-value">{{ recruitDetail.applied_count || '-' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">待处理数量</div>
            <div class="stat-value">{{ recruitDetail.pending_count || '-' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已通过数量</div>
            <div class="stat-value">{{ recruitDetail.passed_count || '-' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已拒绝数量</div>
            <div class="stat-value">{{ recruitDetail.rejected_count || '-' }}</div>
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
      <button class="action-btn primary-btn" @click="handleEdit">
        编辑招聘
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

const emit = defineEmits(['close', 'edit'])

const recruitDetail = ref(null)

// 监听招聘数据变化
watch(() => props.recruitData, (newData) => {
  recruitDetail.value = newData
}, { immediate: true })

// 关闭详情页
const handleClose = () => {
  emit('close')
}

// 编辑招聘
const handleEdit = () => {
  emit('edit', recruitDetail.value)
}

// 获取招聘状态显示文本
const getRecruitStatusText = (recruit) => {
  if (!recruit.is_active) {
    return '未发布'
  } else if (recruit.available) {
    return '可投递'
  } else {
    return '不可投递'
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
.recruit-detail-container {
  width: 100%;
  max-width: 700px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.detail-header h3 {
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
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
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

.detail-group.full-width {
  grid-column: 1 / -1;
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

.detail-value.code {
  font-family: 'Courier New', monospace;
  background: #f1f3f4;
  color: #5f6368;
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

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-active {
  background: rgba(40, 167, 69, 0.2);
  color: #155724;
  border: 1px solid rgba(40, 167, 69, 0.5);
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
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
  background: linear-gradient(135deg, #f8b400 0%, #f39c12 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(248, 180, 0, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 180, 0, 0.4);
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
  .recruit-detail-container {
    width: 95vw;
    max-width: 95vw;
    max-height: 90vh;
  }
  
  .detail-header {
    padding: 1rem 1.5rem;
  }
  
  .recruit-detail {
    padding: 1.5rem;
    max-height: 60vh;
  }
  
  .detail-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
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
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
