<template>
  <div class="applications-list-container">
    <!-- 招聘批次列表视图 -->
    <div class="applications-header">
      <h2 class="section-title">招聘批次</h2>
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ active: showOnlyAvailable }"
          @click="toggleView"
        >
          {{ showOnlyAvailable ? '显示所有批次' : '仅显示可投递' }}
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="recruitList.length === 0" class="no-applications">
      <div class="empty-state">
        <span class="empty-icon">📋</span>
        <h3>暂无招聘批次</h3>
        <p>{{ showOnlyAvailable ? '当前没有可投递的招聘批次' : '暂无任何招聘批次' }}</p>
      </div>
    </div>
    
    <div v-else class="recruit-list">
      <div 
        v-for="recruit in recruitList" 
        :key="recruit.recruit_id"
        class="recruit-card"
      >
        <div class="card-header">
          <div class="recruit-info">
            <h3 class="recruit-title">{{ recruit.name }}</h3>
            <div class="recruit-meta">
              <span class="recruit-id">批次ID: {{ recruit.recruit_id }}</span>
              <span class="recruit-time">
                {{ formatDate(recruit.start_time) }} - {{ formatDate(recruit.end_time) }}
              </span>
            </div>
          </div>
          <div class="recruit-status">
            <span class="status-badge" :class="getRecruitStatusClass(recruit)">
              {{ getRecruitStatusText(recruit) }}
            </span>
            <span v-if="recruit.is_applyed" class="applied-badge">
              已申请
            </span>
          </div>
        </div>
        
        <div class="card-content">
          <div class="recruit-details">
            <div class="detail-item">
              <strong>开始时间：</strong>{{ formatDate(recruit.start_time) }}
            </div>
            <div class="detail-item">
              <strong>结束时间：</strong>{{ formatDate(recruit.end_time) }}
            </div>
            <div class="detail-item">
              <strong>状态：</strong>{{ getRecruitStatusText(recruit) }}
            </div>
          </div>
          
          <div class="card-actions">
            <button
              class="action-btn view-btn"
              @click="viewRecruitDetail(recruit)"
            >
              查看详情
            </button>
            <button
              class="action-btn my-submissions-btn"
              @click="viewMySubmissions(recruit)"
            >
              我的投递
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  recruitList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showOnlyAvailable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-view', 'view-recruit-detail', 'view-my-submissions'])

const toggleView = () => {
  emit('toggle-view')
}

const viewRecruitDetail = (recruit) => {
  emit('view-recruit-detail', recruit)
}

const viewMySubmissions = (recruit) => {
  emit('view-my-submissions', recruit)
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
    minute: '2-digit'
  }).format(new Date(date))
}
</script>

<style scoped>
.applications-list-container {
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

.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #e9ecef;
  border-color: #f8b400;
  color: #f8b400;
}

.toggle-btn.active {
  background: #f8b400;
  color: white;
  border-color: #f8b400;
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

.no-applications {
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

.recruit-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  min-height: 0;
}

.recruit-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #f8b400;
  flex-shrink: 0;
  min-height: 180px;
}

.recruit-card:hover {
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
}

.recruit-info {
  flex: 1;
}

.recruit-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.recruit-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recruit-id {
  font-size: 0.85rem;
  color: #666;
  font-family: monospace;
}

.recruit-time {
  font-size: 0.9rem;
  color: #666;
}

.recruit-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
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

.status-badge {
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

.card-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.recruit-details {
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

.view-btn {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.3);
}

.view-btn:hover {
  background: rgba(13, 110, 253, 0.2);
  transform: translateY(-1px);
}

.my-submissions-btn {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.my-submissions-btn:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.2);
  transform: translateY(-1px);
}

/* 滚动条样式 */
.recruit-list::-webkit-scrollbar {
  width: 6px;
}

.recruit-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.recruit-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.recruit-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .recruit-list {
    overflow-y: auto;
  }
  
  .applications-header {
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
  
  .recruit-card {
    margin: 0 -0.5rem;
    border-radius: 8px;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .recruit-status {
    align-items: flex-start;
    flex-direction: row;
    gap: 1rem;
  }
  
  .recruit-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .recruit-details {
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
  
  .no-applications {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
}
</style>

