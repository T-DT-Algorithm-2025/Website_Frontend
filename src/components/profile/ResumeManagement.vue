<template>
  <div class="resume-list-container">
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="resumeList.length === 0" class="no-resumes">
      <div class="empty-state">
        <span class="empty-icon">📄</span>
        <h3>暂无简历</h3>
        <p>当前筛选条件下没有找到任何简历记录</p>
      </div>
    </div>
    
    <div v-else class="resume-management-list">
      <!-- 全选/取消全选 -->
      <div class="selection-controls">
        <label class="checkbox-container">
          <input 
            type="checkbox" 
            :checked="allSelected" 
            @change="toggleAllSelection"
            :indeterminate.prop="someSelected && !allSelected"
          >
          <span class="checkmark"></span>
          <span class="checkbox-label">
            {{ allSelected ? '取消全选' : someSelected ? `已选择 ${selectedResumes.length} 项` : '全选' }}
          </span>
        </label>
        <span class="total-count">共 {{ resumeList.length }} 份简历</span>
      </div>

      <!-- 简历卡片列表 -->
      <div 
        v-for="resume in resumeList" 
        :key="resume.submit_id"
        class="resume-management-card"
        :class="{ selected: isSelected(resume.submit_id) }"
      >
        <div class="card-header">
          <div class="resume-selection">
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                :checked="isSelected(resume.submit_id)"
                @change="toggleSelection(resume)"
              >
              <span class="checkmark"></span>
            </label>
          </div>
          <div class="resume-info">
            <h3 class="resume-title">{{ resume.display_name }}</h3>
            <div class="resume-meta">
              <span class="resume-time">
                提交时间: {{ formatDate(resume.submit_time) }}
              </span>
            </div>
          </div>
          <div class="resume-status">
            <span class="status-badge" :class="getStatusClass(resume.status)">
              {{ getStatusName(resume.status) }}
            </span>
          </div>
        </div>
        
        <div class="card-content">
          <div class="resume-details">
            <div class="detail-item">
              <strong>招聘批次:</strong> {{ getRecruitName(resume.recruit_id) }}
            </div>
            <div class="detail-item">
              <strong>第一志愿: </strong> 
              <span v-if="resume.first_choice" class="choice-text">{{ resume.first_choice }}</span>
              <span v-else class="not-loaded">未加载</span>
            </div>
            <div class="detail-item">
              <strong>当前状态:</strong> {{ getStatusName(resume.status) }}
            </div>
          </div>
          
          <div class="card-actions">
            <button 
              class="action-btn view-btn" 
              @click="viewResumeDetail(resume)"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  resumeList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  statusNames: {
    type: Array,
    default: () => []
  },
  recruitList: {
    type: Array,
    default: () => []
  },
  selectedResumes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view-detail', 'selection-change'])

// 选择状态计算
const allSelected = computed(() => {
  return props.resumeList.length > 0 && props.selectedResumes.length === props.resumeList.length
})

const someSelected = computed(() => {
  return props.selectedResumes.length > 0
})

// 判断是否已选择
const isSelected = (submitId) => {
  return props.selectedResumes.some(resume => resume.submit_id === submitId)
}

// 切换单个选择
const toggleSelection = (resume) => {
  let newSelection = [...props.selectedResumes]
  
  if (isSelected(resume.submit_id)) {
    // 取消选择
    newSelection = newSelection.filter(selected => selected.submit_id !== resume.submit_id)
  } else {
    // 添加选择
    newSelection.push(resume)
  }
  
  emit('selection-change', newSelection)
}

// 切换全选
const toggleAllSelection = () => {
  if (allSelected.value) {
    // 取消全选
    emit('selection-change', [])
  } else {
    // 全选
    emit('selection-change', [...props.resumeList])
  }
}

// 查看简历详情
const viewResumeDetail = (resume) => {
  emit('view-detail', resume)
}

// 获取状态显示名称
const getStatusName = (statusId) => {
  const status = props.statusNames.find(s => s.status_id === statusId)
  return status ? status.status_name : '未知状态'
}

// 获取状态样式类
const getStatusClass = (statusId) => {
  // 可以根据具体状态ID设置不同的样式类
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

// 获取招聘名称
const getRecruitName = (recruitId) => {
  const recruit = props.recruitList.find(r => r.recruit_id === recruitId)
  return recruit ? recruit.name : (recruitId || '未知招聘')
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
.resume-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
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

.no-resumes {
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

.selection-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.total-count {
  font-size: 0.9rem;
  color: #666;
}

.resume-management-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  min-height: 0;
}

.resume-management-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid #6c757d;
  flex-shrink: 0;
  border: 2px solid transparent;
}

.resume-management-card.selected {
  border-color: #f8b400;
  box-shadow: 0 6px 25px rgba(248, 180, 0, 0.3);
}

.resume-management-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  gap: 1rem;
}

.resume-selection {
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.resume-info {
  flex: 1;
}

.resume-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.resume-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.resume-id {
  font-size: 0.85rem;
  color: #666;
  font-family: monospace;
}

.resume-time {
  font-size: 0.85rem;
  color: #666;
}

.resume-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
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

.card-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.resume-details {
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

.choice-text {
  color: #f8b400;
  font-weight: 500;
}

.not-loaded {
  color: #999;
  font-style: italic;
  font-size: 0.85rem;
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

/* 自定义复选框样式 */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #f8b400;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #f8b400;
  border-color: #f8b400;
}

.checkbox-container input:indeterminate ~ .checkmark {
  background-color: #f8b400;
  border-color: #f8b400;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container input:indeterminate ~ .checkmark:after {
  display: block;
  left: 4px;
  top: 7px;
  width: 8px;
  height: 2px;
  background: white;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  color: #666;
  font-weight: 500;
}

/* 滚动条样式 */
.resume-management-list::-webkit-scrollbar {
  width: 6px;
}

.resume-management-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.resume-management-list::-webkit-scrollbar-thumb {
  background: rgba(248, 180, 0, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.resume-management-list::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 180, 0, 0.5);
}

@media (max-width: 1024px) {
  .resume-management-list {
    overflow-y: auto;
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
  .resume-management-card {
    margin: 0 -0.5rem;
    border-radius: 8px;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .resume-status {
    align-self: flex-start;
  }
  
  .resume-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .resume-details {
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
  
  .no-resumes {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .selection-controls {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}
</style>
